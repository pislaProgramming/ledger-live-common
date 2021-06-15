// @flow
import type { Operation, SignedOperation } from "../../types";
import { patchOperationWithHash } from "../../operation";

import { submit, confirmOperation } from "./api";

/**
 * Broadcast the signed transaction
 * @param {signature: string, operation: string} signedOperation
 */
const broadcast = async ({
  signedOperation: { signature, operation },
}: {
  signedOperation: SignedOperation,
}): Promise<Operation> => {
  const { hash } = await submit({ operation, signature });

  // Set blockHeight and blockHash of operation
  const { blockHeight, blockHash } = await confirmOperation(hash);
  operation.blockHeight = blockHeight;
  operation.blockHash = blockHash;

  return patchOperationWithHash(operation, hash);
};

export default broadcast;
