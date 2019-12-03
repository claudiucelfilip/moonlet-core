import { GenericAccount, IaccountOptions } from "../../core/account";
import { WaveletTransaction, IWaveletTransactionOptions } from "./transaction";
import { WaveletAccountUtils } from "./account-utils";
import { BigNumber } from "bignumber.js";
import nacl from "tweetnacl";
import { Wavelet } from "wavelet-client";

export class WaveletAccount extends GenericAccount<WaveletTransaction, IWaveletTransactionOptions> {
    public supportsCancel: boolean = true;
    private wallet: nacl.SignKeyPair;
    /**
     * Creates an instance of ethereum account.
     * @param accountOptions
     */
    constructor(accountOptions: IaccountOptions) {
        super(accountOptions);
        
        this.utils = new WaveletAccountUtils();

        this.tryWalletSetup();
    }

    /**
     * Trys hd wallet setup
     */
    public tryWalletSetup() {
        if (!this.privateKey) {
            this.wallet = Wavelet.generateNewWallet();
            this.privateKey = this.utils.bufferToHex(Buffer.from(this.wallet.secretKey));
        } else {
            this.wallet = Wavelet.loadWalletFromPrivateKey(this.privateKey);
        }
        
        this.publicKey = this.utils.bufferToHex(Buffer.from(this.wallet.publicKey));
        
        this.address = this.publicKey;
        this.addressFormats.default = this.publicKey;
    }

    /**
     * Gets balance
     * @returns a promise of a balance
     */
    public getBalance(): Promise<BigNumber> {
        return this.node.getBalance( this.address );
    }

    /**
     * Gets nonce
     * @returns a promise of a nonce
     */
    public getNonce(): Promise<number> {
        return this.node.getNonce(this.address);
    }

    /**
     * Builds cancel transaction
     *
     * @remarks
     * Sending a transaction with the same nonce but with higher gas price
     * will cancel an existing non mined transaction if included into a block.
     *
     * @param nonce         - account nonce
     * @param txGasPrice     - gas price in lowest denominator ( wei )
     * @returns a new cancel transaction
     */
    public buildCancelTransaction(nonce: number, txGasPrice: number): WaveletTransaction {
        return this.buildTransferTransaction(this.address, '0', nonce, txGasPrice, 21000);
    }

    /**
     * Builds transfer transaction
     * @param to
     * @param amount
     * @param nonce
     * @param txGasPrice
     * @param txGasLimit
     * @returns transfer transaction
     */
    public buildTransferTransaction(to: string, amount: string, nonce: number, txGasPrice: number, txGasLimit: number): WaveletTransaction {
        return this.buildTransaction(to, amount, nonce, txGasPrice, txGasLimit);
    }

    /**
     * Params ethereum account
     * @param to
     * @param amount
     * @param nonce
     * @param txdata
     * @param [txGasPrice]
     * @param [txGasLimit]
     * @returns a cost estimate
     */
    public estimateTransaction(to: string, amount: string, nonce: number, txdata: Buffer, txGasPrice: number = 1, txGasLimit: number = 6700000): Promise<number> {
        throw Promise.resolve(15);
    }

    /**
     * Builds transaction
     * @param to
     * @param amount
     * @param nonce
     * @param txdata
     * @param txGasPrice
     * @param txGasLimit
     * @returns transaction
     */
    public buildTransaction(to: string, amount: string, nonce: number, txGasPrice: number = 1, txGasLimit: number = 6700000, extra: any = {}): WaveletTransaction {
        const { data } = extra;
        let wallet = this.wallet;
        if (data) {
            wallet = {
                secretKey: new Uint8Array(data.wallet.secretKey),
                publicKey: new Uint8Array(data.wallet.publicKey)
            };
        }
        return new WaveletTransaction(
            this.address,               // from me
            to,                         // to actual receiver
            amount,                     // value in wei
            nonce,                      // account nonce
            {
                gasPrice: txGasPrice,   // price in gwei
                gasLimit: txGasLimit,   // max network allowed gas limit
                chainId: this.node.network.chainId, // current network chain id
                data,
                wallet
            },
        );
    }

    /**
     * Signs transaction
     * @param transaction
     * @returns serialized data
     */
    public signTransaction(transaction: WaveletTransaction): Buffer {
        // const tx = new WaveletJsTx( transaction.toParams() );
        // tx.sign( Buffer.from( this.privateKey.replace("0x", "") , "hex" ) );
        const serialized = Buffer.from([]);
        transaction.setSignedResult(serialized);
        return serialized;
        // return serialized;
    }

    public signMessage(msg: Buffer): string {
        throw new Error('NOT_IMPLEMENTED');
    }
}
