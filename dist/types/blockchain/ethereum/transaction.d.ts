/// <reference types="node" />
import { GenericTransaction, ITransactionOptions } from '../../core/transaction';
export interface IEthereumTransactionOptions extends ITransactionOptions {
    gasPrice: number;
    gasLimit: number;
    chainId: number;
    data?: Buffer;
}
export declare class EthereumTransaction extends GenericTransaction<IEthereumTransactionOptions> {
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
    constructor(from: string, to: string, amount: string, nonce: number, options: IEthereumTransactionOptions);
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
