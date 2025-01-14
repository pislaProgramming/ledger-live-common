// @flow

import type { SwapState, TradeMethod } from "./types";
import { isExchangeSupportedByApp } from "../";
import type { AccountLike, TokenCurrency, CryptoCurrency } from "../../types";
import type { InstalledItem } from "../../apps";
import { flattenAccounts, getAccountCurrency } from "../../account";
export type CurrencyStatus = $Keys<typeof validCurrencyStatus>;
export type CurrenciesStatus = { [string]: CurrencyStatus };
import uniq from "lodash/uniq";

const validCurrencyStatus = { ok: 1, noApp: 1, noAccounts: 1, outdatedApp: 1 };
export const getCurrenciesWithStatus = ({
  accounts,
  selectableCurrencies,
  installedApps,
}: {
  accounts: AccountLike[],
  selectableCurrencies: (TokenCurrency | CryptoCurrency)[],
  installedApps: InstalledItem[],
}): CurrenciesStatus => {
  const statuses = {};
  const installedAppMap = {};
  const notEmptyCurrencies = flattenAccounts(accounts)
    .filter((a) => a.balance.gt(0))
    .map((a) => getAccountCurrency(a).id);

  for (const data of installedApps) installedAppMap[data.name] = data;

  for (const c of selectableCurrencies) {
    if (c.type !== "CryptoCurrency" && c.type !== "TokenCurrency") continue;
    const mainCurrency =
      c.type === "TokenCurrency"
        ? c.parentCurrency
        : c.type === "CryptoCurrency"
        ? c
        : null;

    if (!mainCurrency) continue;
    statuses[c.id] =
      mainCurrency.managerAppName in installedAppMap
        ? isExchangeSupportedByApp(
            mainCurrency.id,
            installedAppMap[mainCurrency.managerAppName].version
          )
          ? notEmptyCurrencies.includes(c.id)
            ? "ok"
            : "noAccounts"
          : "outdatedApp"
        : "noApp";
  }
  return statuses;
};

const reset = {
  isTimerVisible: true,
  ratesExpiration: undefined,
  error: undefined,
  exchangeRate: undefined,
};

const ratesExpirationThreshold = 60000;

export const getValidToCurrencies = ({
  selectableCurrencies,
  fromCurrency,
}: {
  selectableCurrencies: { [TradeMethod]: (TokenCurrency | CryptoCurrency)[] },
  fromCurrency: ?(TokenCurrency | CryptoCurrency),
}): (TokenCurrency | CryptoCurrency)[] => {
  const out = [];
  const tradeMethods = Object.keys(selectableCurrencies);
  for (const tradeMethod of tradeMethods) {
    const currenciesForTradeMethod = selectableCurrencies[tradeMethod];
    if (currenciesForTradeMethod.includes(fromCurrency)) {
      out.push(
        ...selectableCurrencies[tradeMethod].filter((c) => c !== fromCurrency)
      );
    }
  }
  return uniq(out);
};

const allTradeMethods: TradeMethod[] = ["fixed", "float"]; // Flow i give up

export const getEnabledTradeMethods = ({
  selectableCurrencies,
  fromCurrency,
  toCurrency,
}: {
  selectableCurrencies: { [TradeMethod]: (TokenCurrency | CryptoCurrency)[] },
  toCurrency: ?(TokenCurrency | CryptoCurrency),
  fromCurrency: ?(TokenCurrency | CryptoCurrency),
}): TradeMethod[] => {
  const tradeMethods = Object.keys(selectableCurrencies).filter((m) =>
    allTradeMethods.includes(m)
  );
  return fromCurrency && toCurrency
    ? tradeMethods.filter(
        (method) =>
          allTradeMethods.includes(method) &&
          selectableCurrencies[method].includes(fromCurrency) &&
          selectableCurrencies[method].includes(toCurrency)
      )
    : tradeMethods;
};

export const reducer = (
  state: SwapState,
  { type, payload }: { type: string, payload: $Shape<SwapState> }
) => {
  switch (type) {
    case "onResetRate":
      return {
        ...state,
        ...reset,
      };
    case "onSetFromCurrency":
      return {
        ...state,
        fromCurrency: payload.fromCurrency,
        useAllAmount: false,
        toCurrency:
          state.toCurrency === payload.fromCurrency
            ? undefined
            : state.toCurrency,
        exchangeRate: undefined,
      };
    case "onSetToCurrency":
      return {
        ...state,
        toCurrency: payload.toCurrency,
        toAccount: undefined,
        toParentAccount: undefined,
        ...reset,
      };
    case "onSetError":
      return {
        ...state,
        error: payload.error,
      };
    case "onSetExchangeRate":
      return {
        ...state,
        error: undefined,
        exchangeRate: payload.exchangeRate,
        ratesExpiration: payload.withExpiration
          ? new Date(new Date().getTime() + ratesExpirationThreshold)
          : undefined,
      };
    case "onSetUseAllAmount":
      return {
        ...state,
        useAllAmount: payload.useAllAmount,
      };
    case "onSetToAccount":
      return {
        ...state,
        toAccount: payload.toAccount,
        toParentAccount: payload.toParentAccount,
      };
    case "onSetLoadingRates":
      return {
        ...state,
        loadingRates: payload.loadingRates,
      };
    case "onFlip":
      return {
        ...state,
        fromCurrency: state.toCurrency,
        toCurrency: state.fromCurrency,
        toAccount: payload.toAccount,
        toParentAccount: payload.toParentAccount,
      };
  }
  return state || {};
};
