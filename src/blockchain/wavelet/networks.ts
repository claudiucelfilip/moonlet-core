import { Blockchain } from '../../core/blockchain';
import { Network } from '../../core/network';

const networks: Network[] = [
    {
        network_id: 0,
        name: "Local Network",
        chainId: 1,
        blockchain: Blockchain.WAVELET,
        mainNet: false,
        explorerTxPattern: "http://localhost:9000/tx/{txn}",
        explorerAccountPattern: "http://localhost:9000/accounts/{addr}",
        url: "http://localhost:9000",
        HDCoinValue: 1,
    }
];

export default networks;
