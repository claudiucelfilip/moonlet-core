import { TransactionStatus } from './transaction';
import { Blockchain } from './blockchain';
export declare enum WalletEventType {
    TRANSACTION_UPDATE = "TRANSACTION_UPDATE"
}
export declare type WalletEventData = IWalletTransactionUpdate;
export interface IWalletTransactionUpdate {
    blockchain: Blockchain;
    address: string;
    transactionId: string;
    status: TransactionStatus;
}
export declare class WalletEventEmitter {
    private static subscribers;
    static emit(type: WalletEventType, data?: WalletEventData): void;
    static subscribe(callback: (type: WalletEventType, data: WalletEventData) => any): () => any;
}
