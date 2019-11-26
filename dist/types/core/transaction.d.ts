/// <reference types="node" />
import { BigNumber } from 'bignumber.js';
export interface ITransactionOptions {
}
export declare enum TransactionStatus {
    CREATED = "CREATED",
    SIGNED = "SIGNED",
    SUBMITTED = "SUBMITTED",
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}
export declare abstract class GenericTransaction<TO extends ITransactionOptions = ITransactionOptions> {
    static getImplementedClassName(name: string): string;
    id: string;
    from: string;
    to: string;
    nonce: number;
    amount: string;
    options: TO;
    data: Buffer;
    raw: Buffer;
    status: TransactionStatus;
    times: any;
    constructor(from: string, to: string, amount: string, nonce: number, options: TO);
    /**
     * Sets transaction status to signed, adds raw data and indexes event
     * @param data
     */
    setSignedResult(data: Buffer): void;
    /**
     * Sets transaction status to pending and indexes event
     * @param data
     */
    setPending(): void;
    setStatus(status: TransactionStatus): void;
    /**
   * Sets transaction status to final, adds txn and indexes event
   * @param data
   */
    setTxn(txn: string): void;
    /**
     * Converts number to hex string
     * @param num
     * @returns hex representation
     */
    getNumberToHex(num: number | BigNumber): string;
    /**
     * Adds time to current event
     * @param eventName
     */
    addTime(eventName: string): void;
    /**
     * Converts current transaction to a parameters object required for transaction signing
     * @returns parameters object
     */
    abstract toParams(): any;
    abstract updateData(data: any): any;
    abstract serialize(): any;
    abstract setLedgerSignResult(params: any): any;
}
