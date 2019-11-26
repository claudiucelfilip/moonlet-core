/// <reference types="node" />
import { GenericTransaction, ITransactionOptions } from '../../core/transaction';
export interface IWaveletTransactionOptions extends ITransactionOptions {
    gasPrice: number;
    gasLimit: number;
    chainId: number;
    data?: Buffer;
}
export declare class WaveletTransaction extends GenericTransaction<IWaveletTransactionOptions> {
    chainId: number;
    gasPrice: number;
    gasLimit: number;
    usedGas: number;
    /**
     * Creates an instance of an ethereum transaction.
     * @param from
     * @param to
     * @param amount
     * @param nonce
     * @param options
     */
    constructor(from: string, to: string, amount: string, nonce: number, options: IWaveletTransactionOptions);
    /**
     * Converts current transaction to a parameters object required for transaction signing
     * @returns parameters object
     */
    toParams(): {
        nonce: any;
        gasPrice: string;
        gasLimit: string;
        to: string;
        value: string;
        data: string;
        chainId: string;
        v: string;
        r: string;
        s: string;
    };
    serialize(): string;
    setLedgerSignResult(params: any): void;
    setTxn(data: any): void;
    updateData(data: any): void;
}
