import { Blockchain } from '../../core/blockchain';
import { Network } from '../../core/network';

const networks: Network[] = [
    // TODO replace with real testnet once it's released
    {
        network_id: 0,
        name: "Testnet",
        chainId: 1,
        blockchain: Blockchain.WAVELET,
        mainNet: true,
        explorerTxPattern: "http://127.0.0.1:9000/tx/{txn}",
        explorerAccountPattern: "http://127.0.0.1:9000/accounts/{addr}",
        url: "http://127.0.0.1:9000",
        HDCoinValue: 1,
    },
    {
        network_id: 1,
        name: "Local Network",
        chainId: 2,
        blockchain: Blockchain.WAVELET,
        mainNet: false,
        explorerTxPattern: "http://localhost:9000/tx/{txn}",
        explorerAccountPattern: "http://localhost:9000/accounts/{addr}",
        url: "http://localhost:9000",
        HDCoinValue: 1,
    }
];

export default networks;
