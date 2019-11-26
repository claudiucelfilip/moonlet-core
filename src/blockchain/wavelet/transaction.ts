import WaveletJsTx from 'ethereumjs-tx';
import { BigNumber } from 'bignumber.js';
import { TransactionStatus } from './../../core/transaction';
import { GenericTransaction, ITransactionOptions } from '../../core/transaction';
import { WalletEventEmitter, WalletEventType } from '../../core/wallet-event-emitter';
import { Blockchain } from '../../core/blockchain';

export interface IWaveletTransactionOptions extends ITransactionOptions {
    gasPrice: number;
    gasLimit: number;
    chainId: number;
    data?: Buffer;
}

export class WaveletTransaction extends GenericTransaction<IWaveletTransactionOptions> {
    public chainId: number;
    public gasPrice: number;
    public gasLimit: number;
    public usedGas: number;

    /**
     * Creates an instance of an ethereum transaction.
     * @param from
     * @param to
     * @param amount
     * @param nonce
     * @param options
     */
    constructor(from: string, to: string, amount: string, nonce: number, options: IWaveletTransactionOptions) {
        super(from, to, amount, nonce, options);

        this.chainId = options.chainId;
        this.gasPrice = options.gasPrice;
        this.gasLimit = options.gasLimit;
        this.data = options.data || Buffer.from("");
    }

    /**
     * Converts current transaction to a parameters object required for transaction signing
     * @returns parameters object
     */
    public toParams() {
        return {
            nonce: this.getNumberToHex( this.nonce ) as any,
            gasPrice: this.getNumberToHex( this.gasPrice ),
            gasLimit: this.getNumberToHex( this.gasLimit ),
            to: this.to,
            value: this.getNumberToHex( new BigNumber(this.amount) ),
            data: "0x" + this.data,
            chainId: this.getNumberToHex( this.chainId ),

            v: this.getNumberToHex( this.chainId ),
            r: "0x00",
            s: "0x00"
        };
    }

    public serialize() {
        const tx = new WaveletJsTx( this.toParams() );
        return tx.serialize().toString('hex');
    }

    public setLedgerSignResult(params) {
        
        const tx = new WaveletJsTx( Object.assign(this.toParams(), {
            r: '0x' + params.r,
            s: '0x' + params.s,
            v: '0x' + params.v
        }) );
        this.setSignedResult(tx.serialize());
    }

    public setTxn(data: any) {
        super.setTxn(data);
        if (data) {
            this.id = data;
        }
    }

    public updateData(data: any) {
        if (data.transactionHash.toLowerCase() === this.id.toLowerCase()) {
            let status = parseInt(data.status, 16);
            
            this.usedGas = parseInt(data.gasUsed, 16);
            this.setStatus(status === 1 ? TransactionStatus.SUCCESS : TransactionStatus.FAILED);

            WalletEventEmitter.emit(WalletEventType.TRANSACTION_UPDATE, {
                blockchain: Blockchain.ETHEREUM,
                address: this.from,
                transactionId: this.id,
                status: this.status
            });
            
        }
    }
}
