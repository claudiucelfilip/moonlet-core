"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("../../core/blockchain");
const networks = [
    {
        network_id: 0,
        name: "Main Network",
        chainId: 1,
        blockchain: blockchain_1.Blockchain.ETHEREUM,
        mainNet: true,
        explorerTxPattern: "https://etherscan.io/tx/0x{txn}",
        explorerAccountPattern: "https://etherscan.io/address/0x{addr}",
        url: "https://mainnet.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8",
        HDCoinValue: 60,
    },
    {
        network_id: 1,
        name: "Ropsten",
        chainId: 3,
        blockchain: blockchain_1.Blockchain.ETHEREUM,
        mainNet: false,
        explorerTxPattern: "https://ropsten.etherscan.io/tx/0x{txn}",
        explorerAccountPattern: "https://ropsten.etherscan.io/address/0x{addr}",
        url: "https://ropsten.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8",
        HDCoinValue: 1,
    },
    {
        network_id: 2,
        name: "Rinkeby",
        chainId: 4,
        blockchain: blockchain_1.Blockchain.ETHEREUM,
        mainNet: false,
        explorerTxPattern: "https://rinkeby.etherscan.io/tx/0x{txn}",
        explorerAccountPattern: "https://rinkeby.etherscan.io/address/0x{addr}",
        url: "https://rinkeby.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8",
        HDCoinValue: 1,
    },
    {
        network_id: 3,
        name: "Kovan",
        chainId: 42,
        blockchain: blockchain_1.Blockchain.ETHEREUM,
        mainNet: false,
        explorerTxPattern: "https://kovan.etherscan.io/tx/0x{txn}",
        explorerAccountPattern: "https://kovan.etherscan.io/address/0x{addr}",
        url: "https://kovan.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8",
        HDCoinValue: 1,
    },
    {
        network_id: 4,
        name: "Ganache - TestRPC",
        chainId: 15,
        blockchain: blockchain_1.Blockchain.ETHEREUM,
        mainNet: false,
        url: "http://127.0.0.1:8545/",
        HDCoinValue: 60,
    },
];
exports.default = networks;
//# sourceMappingURL=networks.js.map