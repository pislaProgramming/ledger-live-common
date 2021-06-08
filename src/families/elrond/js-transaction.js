// @flow
import { BigNumber } from "bignumber.js";
import type { Account } from "../../types";
import type { Transaction } from "./types";

import getEstimatedFees from "./js-getFeesForTransaction";

const sameFees = (a, b) => (!a || !b ? false : a === b);

/**
 * Create an empty transaction
 *
 * @returns {Transaction}
 */
export const createTransaction = (): Transaction => {
  console.log("createTransaction");
  return {
    family: "elrond",
    mode: "send",
    amount: BigNumber(0),
    recipient: "",
    useAllAmount: false,
    fees: 50000,
  };
};

/**
 * Apply patch to transaction
 *
 * @param {*} t
 * @param {*} patch
 */
export const updateTransaction = (
  t: Transaction,
  patch: $Shape<Transaction>
) => {
  console.log("updateTransaction");
  return { ...t, ...patch };
};

/**
 * Prepare transaction before checking status
 *
 * @param {Account} a
 * @param {Transaction} t
 */
export const prepareTransaction = async (a: Account, t: Transaction) => {
  console.log("prepareTransaction");
  let fees = t.fees;

  console.log("Transaction fees", fees);
  fees = await getEstimatedFees({ a, t });

  if (!sameFees(t.fees, fees)) {
    return { ...t, fees };
  }

  return t;
};
