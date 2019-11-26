"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../core/node");
const networks_1 = __importDefault(require("./networks"));
const bignumber_js_1 = require("bignumber.js");
const wavelet_client_1 = require("wavelet-client");
const axios_1 = __importDefault(require("axios"));
class WaveletNode extends node_1.GenericNode {
    /**
     * Creates an instance of ethereum node.
     * @param [network]
     */
    constructor(network) {
        super();
        this.NETWORKS = networks_1.default;
        this.init(network);
        this.client = new wavelet_client_1.Wavelet(network.url);
    }
    /**
     * Gets balance
     * @param caddress
     * @returns balance
     */
    getBalance(caddress) {
        return this.client.getAccount(caddress).then(({ balance }) => new bignumber_js_1.BigNumber(balance));
    }
    /**
     * Gets nonce
     * @param caddress
     * @returns nonce
     */
    getNonce(caddress) {
        return axios_1.default.get(`${this.network.url}/nonce/${caddress}`).then(({ data }) => data);
    }
    /**
     * Estimates gas
     * @param callArguments
     * @returns gas estimate
     */
    estimateGas(callArguments) {
        return Promise.resolve(15);
        // return this.rpcCall(
        //   "eth_estimateGas",
        //   [callArguments],
        //   "number"
        // ) as Promise<any>;
    }
    /**
     * Gets transaction receipt
     * @param transaction
     * @returns transaction receipt
     */
    getTransactionReceipt(transaction) {
        return null;
        // return this.rpcCall("eth_getTransactionReceipt", [transaction.id], "raw")
        //   .then(data => {
        //     return Promise.resolve(data);
        //   })
        //   .catch(error => {
        //     return Promise.reject(error);
        //   });
    }
    /**
     * Sends a transaction to the current network
     * @param transaction
     * @returns result
     */
    send(transaction) {
        return this.client.transfer();
        // return this.sendRaw("0x" + transaction.raw.toString("hex"));
    }
    /**
     * Sends a raw transaction to the current network
     * @param data
     * @returns result
     */
    sendRaw(data) {
        return this.client.sendTransaction();
        // return this.rpcCall("eth_sendRawTransaction", [data], "raw") as Promise<
        //   any
        // >;
    }
}
WaveletNode.NETWORKS = networks_1.default;
exports.WaveletNode = WaveletNode;
//# sourceMappingURL=node.js.map