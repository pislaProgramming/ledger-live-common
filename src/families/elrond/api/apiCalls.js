import network from "../../../network";

export default class ElrondApi {
  constructor(apiUrl: String) {
    this.apiUrl = apiUrl;
    this.blockHeight = 6;
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

  async getBlockHeight() {
    return this.blockHeight;
  }

  async getValidators() {
    const {
      data: { validators },
    } = await network({
      method: "GET",
      url: `${this.apiUrl}/validator/statistics`,
    });

    return validators;
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
    const {
      data: {
        fee: fees,
        txHash: hash,
        value,
        timestamp,
        sender,
        receiver: recipient,
        nonce,
        status,
      },
    } = await network({
      method: "GET",
      url: `${this.apiUrl}/transactions?condition=should&after=${startAt}&sender=${addr}&receiver=${addr}`,
    });

    return {
      hash,
      fees,
      value,
      timestamp,
      sender,
      recipient,
      nonce,
      success: true ? status === "success" : false,
    };
  }
}
