"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("@zilliqa-js/util/dist/validation");
const blockchain_1 = require("./../../core/blockchain");
const wallet_event_emitter_1 = require("../../core/wallet-event-emitter");
const transaction_1 = require("../../core/transaction");
const util_1 = require("@zilliqa-js/util");
const ZilliqaJsAccountUtil = __importStar(require("@zilliqa-js/account/dist/util"));
const bech32_1 = require("@zilliqa-js/crypto/dist/bech32");
class ZilliqaTransaction extends transaction_1.GenericTransaction {
    /**
     * Creates an instance of a zilliqa transaction.
     * @param from
     * @param to
     * @param amount
     * @param nonce
     * @param options
     */
    constructor(from, to, amount, nonce, options) {
        super(from, to, amount, nonce, options);
        this.version = 1;
        this.pubKey = options.pubKey || "";
        this.code = options.code || Buffer.from("");
        this.chainId = options.chainId;
        this.gasPrice = options.gasPrice;
        this.gasLimit = options.gasLimit;
    }
    /**
     * Converts current transaction to a parameters object required for transaction signing
     * @returns parameters object
     */
    toParams(subPubKey) {
        let toAddr = validation_1.isBech32(this.to) ? bech32_1.fromBech32Address(this.to) : this.to;
        return {
            version: (this.chainId << 16) + this.version,
            toAddr: toAddr.replace("0x", ""),
            nonce: this.nonce,
            pubKey: subPubKey || this.pubKey || "",
            amount: new util_1.BN(this.amount),
            gasPrice: new util_1.BN(this.gasPrice),
            gasLimit: util_1.Long.fromNumber(this.gasLimit),
            code: this.options.code.toString(),
            data: this.options.data.toString(),
            signature: "",
        };
    }
    serialize() {
        const params = this.toParams();
        return Object.assign({}, params, { amount: params.amount.toString(), gasPrice: params.gasPrice.toString(), gasLimit: params.gasLimit.toString() });
    }
    setLedgerSignResult(params) {
        const TXObject = this.toParams(this.pubKey.replace("0x", ""));
        // the address should be checksummed and we need to lowercase it for signing
        // add 0x back to signing payload
        TXObject.toAddr = TXObject.toAddr.toLowerCase();
        TXObject.signature = params.sig;
        const serialized = Buffer.from(JSON.stringify(TXObject));
        this.TXObject = TXObject;
        this.setSignedResult(serialized);
    }
    /**
     * Gets proto encoded tx
     * @param TXObject
     * @returns proto encoded tx
     */
    getProtoEncodedTx(TXObject) {
        return ZilliqaJsAccountUtil.encodeTransactionProto(TXObject);
    }
    setTxn(data) {
        super.setTxn(data);
        if (data.TranID) {
            this.id = data.TranID;
        }
    }
    updateData(data) {
        if (data.ID === this.id) {
            if (data.receipt) {
                this.usedGas = data.receipt.cumulative_gas;
                this.setStatus(data.receipt.success ? transaction_1.TransactionStatus.SUCCESS : transaction_1.TransactionStatus.FAILED);
                wallet_event_emitter_1.WalletEventEmitter.emit(wallet_event_emitter_1.WalletEventType.TRANSACTION_UPDATE, {
                    blockchain: blockchain_1.Blockchain.ZILLIQA,
                    address: this.from,
                    transactionId: this.id,
                    status: this.status
                });
            }
        }
    }
}
exports.ZilliqaTransaction = ZilliqaTransaction;
//# sourceMappingURL=transaction.js.map