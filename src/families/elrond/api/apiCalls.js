import network from "../../../network";
import { HASH_TRANSACTION, RAW_TRANSACTION } from "../constants";

export default class ElrondApi {
  constructor(API_URL: String, GATEWAY_URL: String) {
    this.API_URL = API_URL;
    this.GATEWAY_URL = GATEWAY_URL;
  }

  async getBalance(addr: String) {
    const {
      data: { balance },
    } = await network({
      method: "GET",
      url: `${this.API_URL}/accounts/${addr}`,
    });

    return balance;
  }

  async getNonce(addr: String) {
    const {
      data: { nonce },
    } = await network({
      method: "GET",
      url: `${this.API_URL}/accounts/${addr}`,
    });

    return nonce;
  }

  async getValidators() {
    let data = [];
    try {
      let {
        data: { validators },
      } = await network({
        method: "GET",
        url: `${this.API_URL}/validator/statistics`,
      });
      data = validators;
    } catch (error) {
      return data;
    }

    return data;
  }

  async getNetworkConfig() {
    const {
      data: {
        data: {
          config: {
            erd_chain_id: chainId,
            erd_denomination: denomination,
            erd_min_gas_limit: gasLimit,
            erd_min_gas_price: gasPrice,
          },
        },
      },
    } = await network({
      method: "GET",
      url: `${this.API_URL}/network/config`,
    });

    return { chainId, denomination, gasLimit, gasPrice };
  }

  async submit({ operation, signature, signUsingHash }) {
    const { chainId, gasLimit, gasPrice } = await this.getNetworkConfig();

    const transactionType = signUsingHash ? HASH_TRANSACTION : RAW_TRANSACTION;

    const {
      senders: [sender],
      recipients: [receiver],
      value,
    } = operation;

    const nonce = await this.getNonce(sender);

    const {
      data: {
        data: { txHash: hash },
      },
    } = await network({
      method: "POST",
      url: `${this.API_URL}/transaction/send`,
      data: {
        nonce,
        value,
        receiver,
        sender,
        gasPrice,
        gasLimit,
        chainID: chainId,
        signature,
        ...transactionType,
      },
    });

    return { hash };
  }

  async getHistory(addr: string, startAt: number) {
    const { data: transactions } = await network({
      method: "GET",
      url: `${this.API_URL}/transactions?condition=should&after=${startAt}&sender=${addr}&receiver=${addr}`,
    });

    if (!transactions.length) return transactions; //Account does not have any transactions

    return Promise.all(
      transactions.map(async (transaction) => {
        const { blockHeight, blockHash } = await this.getConfirmedTransaction(
          transaction.txHash
        );

        return { ...transaction, blockHash, blockHeight };
      })
    );
  }

  async getLatestTransaction() {
    const {
      data: [{ txHash }],
    } = await network({
      method: "GET",
      url: `${this.API_URL}/transactions`,
    });

    return txHash;
  }

  async getConfirmedTransaction(txHash: string) {
    const {
      data: {
        data: {
          transaction: { hyperblockNonce, blockHash },
        },
      },
    } = await network({
      method: "GET",
      url: `${this.GATEWAY_URL}/transaction/${txHash}`,
    });

    return { blockHeight: hyperblockNonce, blockHash };
  }
}
