/// <reference types="node" />
/// <reference types="bn.js" />
/// <reference types="long" />
import { GenericTransaction, ITransactionOptions } from '../../core/transaction';
import { BN, Long } from '@zilliqa-js/util';
export interface IZilliqaTransactionOptions extends ITransactionOptions {
    gasPrice: number;
    gasLimit: number;
    chainId: number;
    pubKey?: string;
    code?: Buffer;
    data?: Buffer;
}
export declare class ZilliqaTransaction extends GenericTransaction<IZilliqaTransactionOptions> {
    version: number;
    pubKey: string;
    code: Buffer;
    chainId: number;
    gasPrice: number;
    gasLimit: number;
    usedGas: number;
    TXObject: any;
    /**
     * Creates an instance of a zilliqa transaction.
     * @param from
     * @param to
     * @param amount
     * @param nonce
     * @param options
     */
    constructor(from: string, to: string, amount: string, nonce: number, options: IZilliqaTransactionOptions);
    /**
     * Converts current transaction to a parameters object required for transaction signing
     * @returns parameters object
     */
    toParams(subPubKey?: string): {
        version: number;
        toAddr: string;
        nonce: number;
        pubKey: string;
        amount: BN;
        gasPrice: BN;
        gasLimit: Long;
        code: string;
        data: string;
        signature: string;
    };
    serialize(): {
        amount: string;
        gasPrice: string;
        gasLimit: string;
        version: number;
        toAddr: string;
        nonce: number;
        pubKey: string;
        code: string;
        data: string;
        signature: string;
    };
    setLedgerSignResult(params: any): void;
    /**
     * Gets proto encoded tx
     * @param TXObject
     * @returns proto encoded tx
     */
    getProtoEncodedTx(TXObject: any): Buffer;
    setTxn(data: any): void;
    updateData(data: any): void;
}
