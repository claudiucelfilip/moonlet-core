"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("../../core/account");
const transaction_1 = require("./transaction");
const account_utils_1 = require("./account-utils");
const schnorr = __importStar(require("@zilliqa-js/crypto/dist/schnorr"));
const bech32_1 = require("@zilliqa-js/crypto/dist/bech32");
const validation_1 = require("@zilliqa-js/util/dist/validation");
class ZilliqaAccount extends account_1.GenericAccount {
    /**
     * Creates an instance of zilliqa account.
     * @param accountOptions
     */
    constructor(accountOptions) {
        super(accountOptions);
        this.utils = new account_utils_1.ZilliqaAccountUtils();
        this.tryWalletSetup();
        // transform address in bech32 format
        if (!validation_1.isBech32(this.address)) {
            this.address = bech32_1.toBech32Address(this.address);
        }
        // todo add t in front for testnet addresses
        // if (!this.node.network.mainNet && !this.address.startsWith('t')) {
        //     this.address = 't' + this.address;
        // }
        this.addressFormats = {
            default: this.address,
            base16: bech32_1.fromBech32Address(this.address)
        };
    }
    /**
     * Gets balance
     * @returns a promise of a balance
     */
    getBalance() {
        return this.node.getBalance(this.address);
    }
    /**
     * Gets nonce
     * @returns a promise of a nonce
     */
    getNonce() {
        return this.node.getNonce(this.address);
    }
    /**
     * Builds transfer transaction
     * @param to
     * @param amount
     * @param nonce
     * @param txGasLimit
     * @param txGasPrice
     * @returns transfer transaction
     */
    buildTransferTransaction(to, amount, nonce, txGasPrice, txGasLimit) {
        return this.buildTransaction(to, amount, nonce, txGasPrice, txGasLimit, { data: Buffer.from("") });
    }
    /**
     * Estimates transaction
     * @param to
     * @param amount
     * @param nonce
     * @param txdata
     * @param [txGasPrice]
     * @param [txGasLimit]
     * @returns a cost estimate
     */
    estimateTransaction(to, amount, nonce, txdata, txGasPrice, txGasLimit) {
        throw new Error("Method not implemented.");
        /*
        can be used once GetGasEstimate is implemented in the LookupNode
        // https://github.com/Zilliqa/Zilliqa/blob/db00328e78364c5ae6049f483d8f5bc696027d79/src/libServer/Server.cpp#L580
        // not implemented yet.. returns "Hello"

        return this.node.estimateGas(
            this.buildTransaction(to, amount, nonce, txdata, txGasPrice, txGasLimit).toParams()
        );
        */
    }
    /**
     * Builds transaction
     * @param to
     * @param amount
     * @param nonce
     * @param txdata
     * @param txGasPrice
     * @param txGasLimit
     * @returns transaction
     */
    buildTransaction(to, amount, nonce, txGasPrice = 0, txGasLimit = 8000000, extra = {}) {
        const { code, data } = extra;
        return new transaction_1.ZilliqaTransaction(this.address, // from me
        to, // to actual receiver
        amount, // value in qa
        nonce, // account nonce
        {
            gasPrice: txGasPrice,
            gasLimit: txGasLimit,
            chainId: this.node.network.chainId,
            data: Buffer.from(data || ""),
            code: Buffer.from(code || ""),
            pubKey: this.publicKey
        });
    }
    sign(msg, privateKey, pubKey) {
        const sig = schnorr.sign(msg, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'));
        let r = sig.r.toString('hex');
        let s = sig.s.toString('hex');
        while (r.length < 64) {
            r = '0' + r;
        }
        while (s.length < 64) {
            s = '0' + s;
        }
        return r + s;
    }
    /**
     * Signs transaction
     * @param transaction
     * @returns serialized data
     */
    signTransaction(transaction) {
        const TXObject = transaction.toParams(this.publicKey.replace("0x", ""));
        // the address should be checksummed and we need to lowercase it for signing
        // add 0x back to signing payload
        TXObject.toAddr = TXObject.toAddr.toLowerCase();
        const bytes = transaction.getProtoEncodedTx(TXObject);
        const signature = this.sign(bytes, this.privateKey.replace("0x", ""), this.publicKey.replace("0x", ""));
        TXObject.signature = signature;
        const serialized = Buffer.from(JSON.stringify(TXObject));
        transaction.TXObject = TXObject;
        transaction.setSignedResult(serialized);
        return serialized;
    }
    /**
     * not supported
     */
    buildCancelTransaction(nonce, txGasPrice) {
        return false;
    }
    signMessage(msg) {
        if (typeof msg === 'string') {
            msg = Buffer.from(msg);
        }
        return this.sign(msg, this.privateKey.replace("0x", ""), this.publicKey.replace("0x", ""));
    }
}
exports.ZilliqaAccount = ZilliqaAccount;
//# sourceMappingURL=account.js.map