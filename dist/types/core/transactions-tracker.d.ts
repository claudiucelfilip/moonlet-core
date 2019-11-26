import { GenericTransaction } from './transaction';
import { GenericAccount } from "./account";
export declare class TransactionTracker {
    private static timeoutRef;
    private static readonly TIME_INTERVAL;
    private static transactions;
    static register(account: GenericAccount, transaction: GenericTransaction): void;
    static stop(): void;
    static run(interval?: number): void;
}
