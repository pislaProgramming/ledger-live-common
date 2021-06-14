//@flow
import type { Account } from "../../types";
import type { GetAccountShape } from "../../bridge/jsHelpers";
import { makeSync, makeScanAccounts, mergeOps } from "../../bridge/jsHelpers";

import { getAccount, getOperations } from "./api";

const getAccountShape: GetAccountShape = async (info) => {
  console.log("getAccountShape");
  const { id, address, initialAccount } = info;
  const oldOperations = initialAccount?.operations || [];

  // Needed for incremental synchronisation
  const startAt = oldOperations.length
    ? (oldOperations[0].date.getTime() || 0) + 1
    : 0;

  // get the current account balance state depending your api implementation
  const { blockHeight, balance, nonce } = await getAccount(address);

  // Merge new operations with the previously synced ones
  const newOperations = await getOperations(id, address, startAt);
  const operations = mergeOps(oldOperations, newOperations);

  console.log("operations", operations);

  const shape = {
    id,
    balance,
    spendableBalance: balance,
    operationsCount: operations.length,
    blockHeight,
    elrondResources: {
      nonce,
    },
  };

  console.log("getAccountShape end");
  return { ...shape, operations };
};

const postSync = (initial: Account, parent: Account) => parent;

export const scanAccounts = makeScanAccounts(getAccountShape);

export const sync = makeSync(getAccountShape, postSync);
