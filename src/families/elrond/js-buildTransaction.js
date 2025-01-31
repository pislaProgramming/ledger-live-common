// @flow
import type { Transaction } from "./types";
import type { Account } from "../../types";

import { getNonce, getNetworkConfigs } from "./logic";

import { HASH_TRANSACTION, RAW_TRANSACTION } from "./constants";

/**
 *
 * @param {Account} a
 * @param {Transaction} t
 */
export const buildTransaction = async (
  a: Account,
  t: Transaction,
  signUsingHash: Boolean = true
) => {
  const address = a.freshAddress;
  const nonce = getNonce(a);
  const { gasPrice, gasLimit, chainId } = await getNetworkConfigs();
  const transactionType = signUsingHash ? HASH_TRANSACTION : RAW_TRANSACTION;

  const unsigned = {
    nonce,
    value: t.amount,
    receiver: t.recipient,
    sender: address,
    gasPrice,
    gasLimit,
    chainID: chainId,
    ...transactionType,
  };

  // Will likely be a call to Elrond SDK
  return JSON.stringify(unsigned);
};
