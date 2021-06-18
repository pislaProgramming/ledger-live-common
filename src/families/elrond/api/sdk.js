// @flow

import { BigNumber } from "bignumber.js";
import ElrondApi from "./apiCalls";
import type { Transaction } from "../types";
import type { Operation, OperationType } from "../../../types";
import { getEnv } from "../../../env";
import { encodeOperationId } from "../../../operation";

const ELROND_API_ENDPOINT = () => getEnv("ELROND_API_ENDPOINT");

let api = new ElrondApi(ELROND_API_ENDPOINT());

/**
 * Get account balances and nonce
 */
export const getAccount = async (addr: string) => {
  const balance = await api.getBalance(addr);
  const nonce = await api.getNonce(addr);
  const blockHeight = await api.getBlockchainBlockHeight();

  return {
    blockHeight,
    balance: new BigNumber(balance),
    nonce,
  };
};

export const getValidators = async () => {
  const validators = await api.getValidators();
  return { validators };
};

export const getNetworkConfig = async () => {
  const {
    chainId,
    gasPrice,
    gasLimit,
    denomination,
  } = await api.getNetworkConfig();

  return { chainId, gasPrice, gasLimit, denomination };
};

/**
 * Returns true if account is the signer
 */
function isSender(transaction: Transaction, addr: string): boolean {
  return transaction.sender === addr;
}

/**
 * Map transaction to an Operation Type
 */
function getOperationType(
  transaction: Transaction,
  addr: string
): OperationType {
  return isSender(transaction, addr) ? "OUT" : "IN";
}

/**
 * Map transaction to a correct Operation Value (affecting account balance)
 */
function getOperationValue(transaction: Transaction, addr: string): BigNumber {
  return isSender(transaction, addr)
    ? BigNumber(transaction.value).plus(transaction.fee)
    : BigNumber(transaction.value);
}

/**
 * Map the Elrond history transaction to a Ledger Live Operation
 */
function transactionToOperation(
  accountId: string,
  addr: string,
  transaction: Transaction
): Operation {
  const type = getOperationType(transaction, addr);

  return {
    id: encodeOperationId(accountId, transaction.txHash, type),
    accountId,
    fee: BigNumber(transaction.fee || 0),
    value: getOperationValue(transaction, addr),
    type,
    hash: transaction.txHash,
    blockHash: transaction.blockHash,
    blockHeight: transaction.blockHeight,
    date: new Date(transaction.timestamp * 1000),
    // extra: getOperationExtra(transaction),
    senders: [transaction.sender],
    recipients: transaction.receiver ? [transaction.receiver] : [],
    transactionSequenceNumber: isSender(transaction, addr)
      ? transaction.nonce
      : undefined,
    hasFailed:
      !transaction.status ||
      transaction.status === "fail" ||
      transaction.status === "invalid",
  };
}

/**
 * Fetch operation list
 */
export const getOperations = async (
  accountId: string,
  addr: string
): Promise<Operation[]> => {
  const rawTransactions = await api.getHistory(addr);

  if (!rawTransactions) return rawTransactions;

  return rawTransactions.map((transaction) =>
    transactionToOperation(accountId, addr, transaction)
  );
};

/**
 * Obtain fees from blockchain
 */
export const getFees = async (unsigned): Promise<BigNumber> => {
  const { data, gasLimit } = unsigned;

  if (!data) {
    return BigNumber(gasLimit * 1000000000);
  } else {
    return BigNumber((gasLimit + 1500 * data.length) * 1000000000);
  }
};

/**
 * Broadcast blob to blockchain
 */
export const submit = async (blob: string) => {
  const { hash, fees } = await api.submit(blob);

  // Transaction hash is likely to be returned
  return { hash, fees: BigNumber(fees) };
};
