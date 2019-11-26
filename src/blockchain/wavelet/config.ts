import { Blockchain } from './../../core/blockchain';
import { IBlockchainConfig } from '../../core/blockchain-config';

export const WaveletConfig: IBlockchainConfig = {
    blockchain: Blockchain.WAVELET,
    mainCoin: "PERL",
};

export default WaveletConfig;
