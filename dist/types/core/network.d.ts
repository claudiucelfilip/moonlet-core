import { Blockchain } from "./blockchain";
export interface Network {
    network_id: number;
    blockchain: Blockchain;
    chainId: number;
    name: string;
    url: string;
    mainNet: boolean;
    explorerTxPattern?: string;
    explorerAccountPattern?: string;
    HDCoinValue: number;
}
