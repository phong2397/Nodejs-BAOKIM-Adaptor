const appRootPath = require("app-root-path");
const { config } = require(`${appRootPath}/config/config`);
const TRANSFERMONEY = {
  VERIFYCUSTOMER: config.baokim.disbursement.operation.verifyCustomer,
  TRANSFER: config.baokim.disbursement.operation.transferMoney,
  CHECKTRANSACTION: config.baokim.disbursement.operation.checkTransaction,
  ACCTYPE: 0,
};
const VIRTUALACCOUNT = {
  CREATE: config.baokim.virtualaccount.operation.create, // CREATE VA
  UPDATE: config.baokim.virtualaccount.operation.update, // UPDATE VA
  SEARCH: config.baokim.virtualaccount.operation.search, // SEARCH VA
  TRANSACTION_SEARCH: config.baokim.virtualaccount.operation.transaction, // TRANSACTION SEARCH VA
  CREATETYPE: config.baokim.virtualaccount.settings.createtype, // BAOKIM AUTO GENERTATE ACCOUNT NO
};
module.exports = {
  TRANSFERMONEY: TRANSFERMONEY,
  VIRTUALACCOUNT: VIRTUALACCOUNT,
};
