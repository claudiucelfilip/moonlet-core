import { GenericNode } from "../../core/node";
import { Network } from "../../core/network";
import networks from "./networks";
import { BigNumber } from "bignumber.js";
import { WaveletTransaction } from "./transaction";
import { Wavelet } from "wavelet-client";
import axios from "axios";

export class WaveletNode extends GenericNode {
  private client: Wavelet;
  public static readonly NETWORKS: Network[] = networks;

  /**
   * Creates an instance of ethereum node.
   * @param [network]
   */
  constructor(network?: Network) {
    super();
    this.NETWORKS = networks;
    this.init(network);
    this.client = new Wavelet(this.network.url);
  }

  /**
   * Gets balance
   * @param caddress
   * @returns balance
   */
  public getBalance(caddress: string): Promise<BigNumber> {
    return this.client.getAccount(caddress).then(({ balance }) => new BigNumber(balance));
  }

  /**
   * Gets nonce
   * @param caddress
   * @returns nonce
   */
  public getNonce(caddress: string): Promise<number> {
    return axios.get(`${this.network.url}/nonce/${caddress}`)
      .then(({data}) => data)
      .then(({nonce}) => nonce);
  }

  /**
   * Estimates gas
   * @param callArguments
   * @returns gas estimate
   */
  public estimateGas(callArguments: any): Promise<number> {
      return Promise.resolve(15);
  }

  /**
   * Gets transaction receipt
   * @param transaction
   * @returns transaction receipt
   */
  public getTransactionReceipt(transaction: WaveletTransaction): Promise<any> {
      return this.client.getTransaction(transaction.id);
  }

  /**
   * Sends a transaction to the current network
   * @param transaction
   * @returns result
   */
  public send(transaction: WaveletTransaction): Promise<string> {
    return this.client.transfer(
      transaction.wallet,
      transaction.to,
      transaction.amount
    );
    // return this.sendRaw("0x" + transaction.raw.toString("hex"));
  }

  /**
   * Sends a raw transaction to the current network
   * @param data
   * @returns result
   */
  public sendRaw(data: any): Promise<string> {
    return this.client.sendTransaction();
    // return this.rpcCall("eth_sendRawTransaction", [data], "raw") as Promise<
    //   any
    // >;
  }
}
