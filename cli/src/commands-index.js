import app from "./commands/app";
import appsCheckAllAppVersions from "./commands/appsCheckAllAppVersions";
import appsInstallAll from "./commands/appsInstallAll";
import appsUpdateTestAll from "./commands/appsUpdateTestAll";
import appUninstallAll from "./commands/appUninstallAll";
import balanceHistory from "./commands/balanceHistory";
import bot from "./commands/bot";
import botPortfolio from "./commands/botPortfolio";
import broadcast from "./commands/broadcast";
import cleanSpeculos from "./commands/cleanSpeculos";
import countervalues from "./commands/countervalues";
import derivation from "./commands/derivation";
import devDeviceAppsScenario from "./commands/devDeviceAppsScenario";
import deviceAppVersion from "./commands/deviceAppVersion";
import deviceInfo from "./commands/deviceInfo";
import deviceVersion from "./commands/deviceVersion";
import discoverDevices from "./commands/discoverDevices";
import envs from "./commands/envs";
import estimateMaxSpendable from "./commands/estimateMaxSpendable";
import exportAccounts from "./commands/exportAccounts";
import firmwareRepair from "./commands/firmwareRepair";
import firmwareUpdate from "./commands/firmwareUpdate";
import generateTestScanAccounts from "./commands/generateTestScanAccounts";
import generateTestTransaction from "./commands/generateTestTransaction";
import genuineCheck from "./commands/genuineCheck";
import getAccountNetworkInfo from "./commands/getAccountNetworkInfo";
import getAddress from "./commands/getAddress";
import getTransactionStatus from "./commands/getTransactionStatus";
import libcoreReset from "./commands/libcoreReset";
import libcoreSetPassword from "./commands/libcoreSetPassword";
import liveData from "./commands/liveData";
import makeCompoundSummary from "./commands/makeCompoundSummary";
import managerListApps from "./commands/managerListApps";
import portfolio from "./commands/portfolio";
import proxy from "./commands/proxy";
import receive from "./commands/receive";
import repl from "./commands/repl";
import satstack from "./commands/satstack";
import satstackStatus from "./commands/satstackStatus";
import scanDescriptors from "./commands/scanDescriptors";
import send from "./commands/send";
import signMessage from "./commands/signMessage";
import swap from "./commands/swap";
import sync from "./commands/sync";
import testDetectOpCollision from "./commands/testDetectOpCollision";
import testGetTrustedInputFromTxHash from "./commands/testGetTrustedInputFromTxHash";
import validRecipient from "./commands/validRecipient";
import version from "./commands/version";
import walletconnect from "./commands/walletconnect";

export default {
  app,
  appsCheckAllAppVersions,
  appsInstallAll,
  appsUpdateTestAll,
  appUninstallAll,
  balanceHistory,
  bot,
  botPortfolio,
  broadcast,
  cleanSpeculos,
  countervalues,
  derivation,
  devDeviceAppsScenario,
  deviceAppVersion,
  deviceInfo,
  deviceVersion,
  discoverDevices,
  envs,
  estimateMaxSpendable,
  exportAccounts,
  firmwareRepair,
  firmwareUpdate,
  generateTestScanAccounts,
  generateTestTransaction,
  genuineCheck,
  getAccountNetworkInfo,
  getAddress,
  getTransactionStatus,
  libcoreReset,
  libcoreSetPassword,
  liveData,
  makeCompoundSummary,
  managerListApps,
  portfolio,
  proxy,
  receive,
  repl,
  satstack,
  satstackStatus,
  scanDescriptors,
  send,
  signMessage,
  swap,
  sync,
  testDetectOpCollision,
  testGetTrustedInputFromTxHash,
  validRecipient,
  version,
  walletconnect,
};
