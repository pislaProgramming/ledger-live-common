import network from "../../../network";

export default class ElrondApi {
  constructor(apiUrl: String) {
    this.apiUrl = apiUrl;
  }

  async getBalance(addr: String) {
    const {
      data: { balance },
    } = await network({
      method: "GET",
      url: `${this.apiUrl}/accounts/${addr}`,
    });

    return balance;
  }

  async getNonce(addr: String) {
    const {
      data: { nonce },
    } = await network({
      method: "GET",
      url: `${this.apiUrl}/accounts/${addr}`,
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
        url: `${this.apiUrl}/validator/statistics`,
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
      url: `${this.apiUrl}/network/config`,
    });

    return { chainId, denomination, gasLimit, gasPrice };
  }

  async submit({ operation, signature }) {
    const { chainId, gasLimit, gasPrice } = await this.getNetworkConfig();

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
      url: `${this.apiUrl}/transaction/send`,
      data: {
        nonce,
        value,
        receiver,
        sender,
        gasPrice,
        gasLimit,
        chainID: chainId,
        version: 2,
        options: 1,
        signature,
      },
    });

    return { hash };
  }

  async getHistory(addr: string, startAt: number) {
    const { data: transactions } = await network({
      method: "GET",
      url: `${this.apiUrl}/transactions?condition=should&after=${startAt}&sender=${addr}&receiver=${addr}`,
    });

    return Promise.all(
      transactions.map(async (transaction) => {
        const { blockHeight, blockHash } = await this.getConfirmedTransaction(
          transaction.txHash
        );

        return { ...transaction, blockHash, blockHeight };
      })
    );
  }

  async getLatestTransaction(addr: string) {
    const {
      data: [{ txHash }],
    } = await network({
      method: "GET",
      url: `${this.apiUrl}/transactions?condition=should&sender=${addr}&receiver=${addr}`,
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
      url: `https://testnet-gateway.elrond.com/transaction/${txHash}`,
    });

    return { blockHeight: hyperblockNonce, blockHash };
  }
}
