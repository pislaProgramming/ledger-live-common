//@flow
import type { Account } from "../../types";
import type { GetAccountShape } from "../../bridge/jsHelpers";
import { makeSync, makeScanAccounts, mergeOps } from "../../bridge/jsHelpers";

import { getAccount, getOperations } from "./api";

const getAccountShape: GetAccountShape = async (info) => {
  const { id, address, initialAccount } = info;
  const oldOperations = initialAccount?.operations || [];

  // get the current account balance state depending your api implementation
  const { blockHeight, balance, nonce } = await getAccount(address);

  // Merge new operations with the previously synced ones
  const newOperations = await getOperations(id, address);
  const operations = mergeOps(oldOperations, newOperations);

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

  return { ...shape, operations };
};

const postSync = (initial: Account, parent: Account) => parent;

export const scanAccounts = makeScanAccounts(getAccountShape);

export const sync = makeSync(getAccountShape, postSync);
