/// <reference types="node" />
import { Blockchain } from "./blockchain";
import { GenericNode } from "./node";
import { GenericAccount, HWDevice } from "./account";
import DynamicClassMapper from "../class.store";
import { IBlockchainImplementation } from "./blockchain-implementation";
import { WalletEventType, WalletEventData } from "./wallet-event-emitter";
import { GenericTransaction } from "./transaction";
export interface WalletExport {
    mnemonics: string;
    mnemonicslang: string;
    blockchains: any;
    currentNetworks: {};
    seed: string;
    accounts: {};
    nodes: {};
    version: string;
}
export default class Wallet {
    /**
     * Instantiate wallet using a serialised data
     * @param json
     * @param [blockchains]
     */
    static fromJson(json: string, blockchains?: IBlockchainImplementation[]): Wallet;
    mnemonics: string;
    mnemonicslang: string;
    seed: Buffer;
    nodes: Map<Blockchain, Map<number, GenericNode>>;
    accounts: Map<Blockchain, GenericAccount[]>;
    currentNetwork: any;
    private mapper;
    /**
     * Creates an instance of wallet.
     * @param [mnemonics]
     * @param [language]
     * @param [mnemonicPassword]
     */
    constructor(mnemonics?: string, language?: string, mnemonicPassword?: string);
    /**
     * Gets class mapper
     * @returns class mapper
     */
    getClassMapper(): DynamicClassMapper;
    /**
     * Loads blockchain implementation
     * @param blockchainImplementation
     */
    loadBlockchain(blockchainImplementation: IBlockchainImplementation): void;
    /**
     * Gets accounts
     * @param blockchain
     * @param [reference]
     * @param [filter]
     * @param [networkId]
     * @returns accounts
     */
    getAccounts(blockchain: Blockchain, reference?: boolean, filter?: boolean, networkId?: number): GenericAccount[];
    /**
     * Gets accounts map
     * @returns accounts map
     */
    getAccountsMap(): Map<Blockchain, GenericAccount[]>;
    removeAccount(blockchain: Blockchain, address: string, networkId?: number): void;
    /**
     * Gets blockchain
     * @param blockchain
     * @returns an object containing all methods required to use this implementation
     */
    getBlockchain(blockchain: Blockchain): {
        getNode: () => GenericNode;
        getAccounts: () => GenericAccount<GenericTransaction<import("./transaction").ITransactionOptions>, import("./transaction").ITransactionOptions>[];
        getAllAccounts: () => GenericAccount<GenericTransaction<import("./transaction").ITransactionOptions>, import("./transaction").ITransactionOptions>[];
        createAccount: () => GenericAccount<GenericTransaction<import("./transaction").ITransactionOptions>, import("./transaction").ITransactionOptions>;
        importAccount: (account: GenericAccount<GenericTransaction<import("./transaction").ITransactionOptions>, import("./transaction").ITransactionOptions>) => GenericAccount<GenericTransaction<import("./transaction").ITransactionOptions>, import("./transaction").ITransactionOptions>;
        importAccountByPrivateKey: (privateKey: string) => any;
        importHWAccount: (deviceType: HWDevice, derivationPath: string, address: string, publicKey: string, accountIndex: string, derivationIndex: string) => GenericAccount<GenericTransaction<import("./transaction").ITransactionOptions>, import("./transaction").ITransactionOptions>;
        getNetworks: () => import("./network").Network[];
        getCurrentNetwork: () => number;
        switchNetwork: (networkId: any) => GenericNode;
        getInitializedNodes: () => Map<number, GenericNode>;
        removeAccount: (address: string, networkId?: number) => void;
    };
    subscribe(callback: (type: WalletEventType, data: WalletEventData) => any): () => any;
    /**
     * Gets networks
     * @param blockchain
     * @returns networks
     */
    getNetworks(blockchain: Blockchain): import("./network").Network[];
    /**
     * Gets current network for specified blockchain
     * @param blockchain
     * @returns current network
     */
    getCurrentNetwork(blockchain: Blockchain): number;
    /**
     * Switches network for specified blockchain
     * @param blockchain
     * @param networkId
     */
    switchNetwork(blockchain: Blockchain, networkId: number): GenericNode;
    /**
     * Gets existing node or initialises a new one for specified blockchain
     * @param blockchain
     * @param [networkId]
     * @returns node
     */
    getNode(blockchain: Blockchain, networkId?: number): GenericNode;
    /**
     * Creates an account on specified blockchain and network
     * @param blockchain
     * @param [networkId]
     * @returns account
     */
    createAccount(blockchain: Blockchain, networkId?: number): GenericAccount;
    /**
     * Requires implementation
     * @param blockchain
     * @param method
     * @returns true if implementation is found, otherwise false
     */
    requireImplementation(blockchain: Blockchain, method: string): boolean;
    /**
     * Imports account
     * @param account
     * @returns account
     */
    importAccount(account: GenericAccount): GenericAccount;
    /**
     * Imports account
     * @param account
     * @returns account
     */
    importHWAccount(deviceType: HWDevice, blockchain: Blockchain, derivationPath: string, address: string, publicKey: string, accountIndex: string, derivationIndex: string): GenericAccount;
    importAccountByPrivateKey(blockchain: Blockchain, privateKey: string): any;
    /**
     * Serialises wallet and returns a json string
     * @returns json
     */
    toJSON(): string;
}
