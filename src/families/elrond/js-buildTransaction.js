// @flow
import type { Transaction } from "./types";
import type { Account } from "../../types";

import { getNonce, getNetworkConfigs } from "./logic";

/**
 *
 * @param {Account} a
 * @param {Transaction} t
 */
export const buildTransaction = async (a: Account, t: Transaction) => {
  const address = a.freshAddress;
  const nonce = getNonce(a);
  const { gasPrice, gasLimit, chainId } = await getNetworkConfigs();
  const options = 1;
  const version = 2;

  const unsigned = {
    nonce,
    value: t.amount,
    receiver: t.recipient,
    sender: address,
    gasPrice,
    gasLimit,
    chainID: chainId,
    version,
    options,
  };

  // Will likely be a call to Elrond SDK
  return JSON.stringify(unsigned);
};
