/// <reference types="node" />
import { GenericAccount, IaccountOptions } from "../../core/account";
import { WaveletTransaction, IWaveletTransactionOptions } from "./transaction";
import { BigNumber } from "bignumber.js";
export declare class WaveletAccount extends GenericAccount<WaveletTransaction, IWaveletTransactionOptions> {
    supportsCancel: boolean;
    /**
     * Creates an instance of ethereum account.
     * @param accountOptions
     */
    constructor(accountOptions: IaccountOptions);
    /**
     * Gets balance
     * @returns a promise of a balance
     */
    getBalance(): Promise<BigNumber>;
    /**
     * Gets nonce
     * @returns a promise of a nonce
     */
    getNonce(): Promise<number>;
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
    buildCancelTransaction(nonce: number, txGasPrice: number): WaveletTransaction;
    /**
     * Builds transfer transaction
     * @param to
     * @param amount
     * @param nonce
     * @param txGasPrice
     * @param txGasLimit
     * @returns transfer transaction
     */
    buildTransferTransaction(to: string, amount: string, nonce: number, txGasPrice: number, txGasLimit: number): WaveletTransaction;
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
    estimateTransaction(to: string, amount: string, nonce: number, txdata: Buffer, txGasPrice?: number, txGasLimit?: number): Promise<number>;
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
    buildTransaction(to: string, amount: string, nonce: number, txGasPrice?: number, txGasLimit?: number, extra?: any): WaveletTransaction;
    /**
     * Signs transaction
     * @param transaction
     * @returns serialized data
     */
    signTransaction(transaction: WaveletTransaction): Buffer;
    signMessage(msg: Buffer): string;
}
