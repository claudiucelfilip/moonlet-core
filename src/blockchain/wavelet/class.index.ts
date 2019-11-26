import { WaveletAccountUtils } from './account-utils';
import { WaveletAccount } from "./account";
import { WaveletNode } from "./node";
import { WaveletTransaction } from "./transaction";

import config from "./config";
import networks from "./networks";
import { IBlockchainImplementation } from "../../core/blockchain-implementation";

const AvailableClasses = {
    WaveletAccount,
    WaveletNode,
    WaveletTransaction,
    WaveletAccountUtils
};

export const Wavelet: IBlockchainImplementation = {
    AvailableClasses,
    config,
    networks,
};

export default Wavelet;
