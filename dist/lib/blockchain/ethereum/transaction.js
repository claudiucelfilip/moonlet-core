"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_tx_1 = __importDefault(require("ethereumjs-tx"));
const bignumber_js_1 = require("bignumber.js");
const transaction_1 = require("./../../core/transaction");
const transaction_2 = require("../../core/transaction");
const wallet_event_emitter_1 = require("../../core/wallet-event-emitter");
const blockchain_1 = require("../../core/blockchain");
class EthereumTransaction extends transaction_2.GenericTransaction {
    /**
     * Creates an instance of an ethereum transaction.
     * @param from
     * @param to
     * @param amount
     * @param nonce
     * @param options
     */
    constructor(from, to, amount, nonce, options) {
        super(from, to, amount, nonce, options);
        this.chainId = options.chainId;
        this.gasPrice = options.gasPrice;
        this.gasLimit = options.gasLimit;
        this.data = options.data || Buffer.from("");
    }
    /**
     * Converts current transaction to a parameters object required for transaction signing
     * @returns parameters object
     */
    toParams() {
        return {
            nonce: this.getNumberToHex(this.nonce),
            gasPrice: this.getNumberToHex(this.gasPrice),
            gasLimit: this.getNumberToHex(this.gasLimit),
            to: this.to,
            value: this.getNumberToHex(new bignumber_js_1.BigNumber(this.amount)),
            data: "0x" + this.data,
            chainId: this.getNumberToHex(this.chainId),
            v: this.getNumberToHex(this.chainId),
            r: "0x00",
            s: "0x00"
        };
    }
    serialize() {
        const tx = new ethereumjs_tx_1.default(this.toParams());
        return tx.serialize().toString('hex');
    }
    setLedgerSignResult(params) {
        const tx = new ethereumjs_tx_1.default(Object.assign(this.toParams(), {
            r: '0x' + params.r,
            s: '0x' + params.s,
            v: '0x' + params.v
        }));
        this.setSignedResult(tx.serialize());
    }
    setTxn(data) {
        super.setTxn(data);
        if (data) {
            this.id = data;
        }
    }
    updateData(data) {
        if (data.transactionHash.toLowerCase() === this.id.toLowerCase()) {
            let status = parseInt(data.status, 16);
            this.usedGas = parseInt(data.gasUsed, 16);
            this.setStatus(status === 1 ? transaction_1.TransactionStatus.SUCCESS : transaction_1.TransactionStatus.FAILED);
            wallet_event_emitter_1.WalletEventEmitter.emit(wallet_event_emitter_1.WalletEventType.TRANSACTION_UPDATE, {
                blockchain: blockchain_1.Blockchain.ETHEREUM,
                address: this.from,
                transactionId: this.id,
                status: this.status
            });
        }
    }
}
exports.EthereumTransaction = EthereumTransaction;
//# sourceMappingURL=transaction.js.map