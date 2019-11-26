"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("../../core/node");
const networks_1 = __importDefault(require("./networks"));
const bignumber_js_1 = require("bignumber.js");
const ZilliqaJsCrypto = __importStar(require("@zilliqa-js/crypto/dist/util"));
const bech32_1 = require("@zilliqa-js/crypto/dist/bech32");
class ZilliqaNode extends node_1.GenericNode {
    /**
     * Creates an instance of zilliqa node.
     * @param [network]
     */
    constructor(network) {
        super();
        this.NETWORKS = networks_1.default;
        this.init(network);
    }
    /**
     * Gets balance
     * @param caddress
     * @returns balance
     */
    getBalance(caddress) {
        const call = this.rpcCall("GetBalance", [bech32_1.fromBech32Address(caddress).replace("0x", "").toLowerCase()], "");
        return call.then((data) => {
            return new bignumber_js_1.BigNumber(data.balance);
        }).catch((error) => {
            if (error.message === "Account is not created") {
                return Promise.resolve(new bignumber_js_1.BigNumber(0));
            }
            return Promise.reject(new Error(error));
        });
    }
    /**
     * Gets nonce
     * @param caddress
     * @returns nonce
     */
    getNonce(caddress) {
        const call = this.rpcCall("GetBalance", [bech32_1.fromBech32Address(caddress).replace("0x", "").toLowerCase()], "");
        return call.then((data) => {
            return data.nonce;
        }).catch((error) => {
            if (error.message === "Account is not created") {
                return Promise.resolve(0);
            }
            return Promise.reject(new Error(error));
        });
    }
    /**
     * Estimates gas
     * @param callArguments
     * @returns gas estimate
     */
    estimateGas(callArguments) {
        throw new Error("Method not implemented.");
        /*
        // https://github.com/Zilliqa/Zilliqa/blob/db0 0328e78364c5ae6049f483d8f5bc696027d79/src/libServer/Server.cpp#L580
        // not implemented yet.. returns "Hello"
        return this.rpcCall("GetGasEstimate", [
            callArguments,
        ], "number") as Promise<any>;
        */
    }
    /**
     * Gets transaction receipt
     * @param transaction
     * @returns transaction receipt
     */
    getTransactionReceipt(transaction) {
        if (transaction.id) {
            return this.rpcCall("GetTransaction", [transaction.id.replace("0x", "").toLowerCase()], "").then(data => {
                data.toAddr = bech32_1.toBech32Address(data.toAddr);
                return data;
            });
        }
        else {
            return Promise.reject('No transaction id available.');
        }
    }
    /**
     * Sends a transaction to the current network
     * @param transaction
     * @returns result
     */
    send(transaction) {
        // cast properties as expected by Zilliqa Nodes.
        const SendObject = transaction.TXObject;
        SendObject.amount = SendObject.amount.toString();
        SendObject.gasPrice = SendObject.gasPrice.toString();
        SendObject.gasLimit = SendObject.gasLimit.toString();
        // remove once core accepts 0x
        SendObject.toAddr = ZilliqaJsCrypto.toChecksumAddress(SendObject.toAddr).replace("0x", "");
        return this.sendRaw(SendObject);
    }
    /**
     * Sends a raw transaction to the current network
     * @param data
     * @returns result
     */
    sendRaw(data) {
        return this.rpcCall("CreateTransaction", [data], "raw");
    }
}
ZilliqaNode.NETWORKS = networks_1.default;
exports.ZilliqaNode = ZilliqaNode;
//# sourceMappingURL=node.js.map