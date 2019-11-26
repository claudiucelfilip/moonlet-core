"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("../../core/account");
const transaction_1 = require("./transaction");
const account_utils_1 = require("./account-utils");
const ethereumjs_tx_1 = __importDefault(require("ethereumjs-tx"));
class WaveletAccount extends account_1.GenericAccount {
    /**
     * Creates an instance of ethereum account.
     * @param accountOptions
     */
    constructor(accountOptions) {
        super(accountOptions);
        this.supportsCancel = true;
        this.utils = new account_utils_1.WaveletAccountUtils();
        this.tryWalletSetup();
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
     * Builds cancel transaction
     *
     * @remarks
     * Sending a transaction with the same nonce but with higher gas price
     * will cancel an existing non mined transaction if included into a block.
     *
     * @param nonce         - account nonce
     * @param txGasPrice     - gas price in lowest denominator ( wei )
     * @returns a new cancel transaction
     */
    buildCancelTransaction(nonce, txGasPrice) {
        return this.buildTransferTransaction(this.address, '0', nonce, txGasPrice, 21000);
    }
    /**
     * Builds transfer transaction
     * @param to
     * @param amount
     * @param nonce
     * @param txGasPrice
     * @param txGasLimit
     * @returns transfer transaction
     */
    buildTransferTransaction(to, amount, nonce, txGasPrice, txGasLimit) {
        return this.buildTransaction(to, amount, nonce, txGasPrice, txGasLimit, { data: Buffer.from("") });
    }
    /**
     * Params ethereum account
     * @param to
     * @param amount
     * @param nonce
     * @param txdata
     * @param [txGasPrice]
     * @param [txGasLimit]
     * @returns a cost estimate
     */
    estimateTransaction(to, amount, nonce, txdata, txGasPrice = 1, txGasLimit = 6700000) {
        return this.node.estimateGas(this.buildTransaction(to, amount, nonce, txGasPrice, txGasLimit, { data: txdata }).toParams());
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
    buildTransaction(to, amount, nonce, txGasPrice = 1, txGasLimit = 6700000, extra = {}) {
        return new transaction_1.WaveletTransaction(this.address, // from me
        to, // to actual receiver
        amount, // value in wei
        nonce, // account nonce
        {
            gasPrice: txGasPrice,
            gasLimit: txGasLimit,
            chainId: this.node.network.chainId,
            data: extra.data,
        });
    }
    /**
     * Signs transaction
     * @param transaction
     * @returns serialized data
     */
    signTransaction(transaction) {
        const tx = new ethereumjs_tx_1.default(transaction.toParams());
        tx.sign(Buffer.from(this.privateKey.replace("0x", ""), "hex"));
        const serialized = tx.serialize();
        transaction.setSignedResult(serialized);
        return serialized;
    }
    signMessage(msg) {
        throw new Error('NOT_IMPLEMENTED');
    }
}
exports.WaveletAccount = WaveletAccount;
//# sourceMappingURL=account.js.map