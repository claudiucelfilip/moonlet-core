"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("../../core/blockchain");
const networks = [
    {
        network_id: 0,
        name: "Local Network",
        chainId: 1,
        blockchain: blockchain_1.Blockchain.WAVELET,
        mainNet: false,
        explorerTxPattern: "http://localhost:9000/tx/{txn}",
        explorerAccountPattern: "http://localhost:9000/accounts/{addr}",
        url: "http://localhost:9000",
        HDCoinValue: 1,
    }
];
exports.default = networks;
//# sourceMappingURL=networks.js.map