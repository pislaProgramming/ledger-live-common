// @flow
import invariant from "invariant";
import { BigNumber } from "bignumber.js";
import type { Account, Operation, Unit } from "../../types";
import { getAccountUnit } from "../../account";
import { formatCurrencyUnit } from "../../currencies";

function formatAccountSpecifics(account: Account): string {
  const { elrondResources } = account;
  invariant(elrondResources, "elrond account expected");
  const unit = getAccountUnit(account);
  const formatConfig = {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
  };

  let str = " ";

  if (account.spendableBalance) {
    str +=
      formatCurrencyUnit(unit, account.spendableBalance, formatConfig) +
      " spendable. ";
  } else {
    str += " 0 spendable.";
  }

  if (elrondResources.nonce) {
    str += "\nonce : " + elrondResources.nonce;
  }

  return str;
}

function formatOperationSpecifics(op: Operation, unit: ?Unit): string {
  // const { additionalField } = op.extra;

  let str = " ";

  const formatConfig = {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
  };

  // str +=
  //   additionalField && !additionalField.isNaN()
  //     ? `\n    additionalField: ${
  //         unit
  //           ? formatCurrencyUnit(unit, additionalField, formatConfig)
  //           : additionalField
  //       }`
  //     : "";

  return str;
}

// export function fromOperationExtraRaw(extra: ?Object) {
//   if (extra && extra.additionalField) {
//     extra = {
//       ...extra,
//       additionalField: BigNumber(extra.additionalField),
//     };
//   }
//   return extra;
// }

// export function toOperationExtraRaw(extra: ?Object) {
//   if (extra && extra.additionalField) {
//     extra = {
//       ...extra,
//       additionalField: extra.additionalField.toString(),
//     };
//   }
//   return extra;
// }

export default {
  formatAccountSpecifics,
  formatOperationSpecifics,
  // fromOperationExtraRaw,
  // toOperationExtraRaw,
};
