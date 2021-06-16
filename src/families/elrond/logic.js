// @flow
import type { Account } from "../../types";

import { getNetworkConfig } from "./api";
import bech32 from "bech32";

export const MAX_AMOUNT = 5000;

/**
 * Returns true if address is a valid bech32
 *
 * @param {string} address
 */
export const isValidAddress = (address: string): boolean => {
  if (!address) return false;

  try {
    const decodedAddress = bech32.decode(address, 256);
    const publicKey = Buffer.from(
      bech32.fromWords(decodedAddress.words)
    ).toString("hex");

    console.log("address", address);
    console.log("publicKey", publicKey);

    return !!publicKey.match(/^[a-f0-9]{64}$/);
  } catch (error) {
    return false;
  }
};

/**
 * Returns nonce for an account
 *
 * @param {Account} a
 */
export const getNonce = (a: Account): number => {
  const lastPendingOp = a.pendingOperations[0];

  const nonce = Math.max(
    a.elrondResources?.nonce || 0,
    lastPendingOp && typeof lastPendingOp.transactionSequenceNumber === "number"
      ? lastPendingOp.transactionSequenceNumber + 1
      : 0
  );

  return nonce;
};

export const getNetworkConfigs = async () => {
  const {
    chainId,
    gasPrice,
    gasLimit,
    denomination,
  } = await getNetworkConfig();

  return { chainId, gasPrice, gasLimit, denomination };
};
