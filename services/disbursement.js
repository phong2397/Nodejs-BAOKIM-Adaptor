const appRootPath = require("app-root-path");
const axios = require("axios");
const { requestFactory } = require("../utils/baokim/baokim-utils");
const producer = require("../utils/taskqueue/procducer");
const { config } = require(`${appRootPath}/config/config`);
const { TRANSFERMONEY } = require("../utils/enum/enum");
const TRANSFERMONEY_URL = config.baokim.transferMoneyUrl;

var validateCustomer = async function (accNo, bankNo) {
  let requestInfo = new requestFactory().createRequestInfo(
    "transfermoney",
    TRANSFERMONEY.VERIFYCUSTOMER,
    { accNo, bankNo },
  );
  let headers = {
    "Content-Type": "application/json",
  };
  let res = await axios.post(TRANSFERMONEY_URL, requestInfo, {
    headers,
  });
  return res;
};
var transferMoney = async function (accNo, bankNo, requestAmount, memo) {
  let requestInfo = new requestFactory().createRequestInfo(
    "transfermoney",
    TRANSFERMONEY.TRANSFER,
    { accNo, bankNo, requestAmount, memo },
  );
  let headers = {
    "Content-Type": "application/json",
  };
  console.log(requestInfo.getRawDataFormatted());
  let res = await axios.post(TRANSFERMONEY_URL, requestInfo, {
    headers,
  });
  //Send to queue
  //let res = await producer.sendPayment(requestInfo);
  return res;
};
var checkTransaction = async function (referenceId) {
  let requestInfo = new requestFactory().createRequestInfo(
    "transfermoney",
    TRANSFERMONEY.CHECKTRANSACTION,
    { referenceId },
  );
  let headers = {
    "Content-Type": "application/json",
  };
  let res = await axios.post(TRANSFERMONEY_URL, requestInfo, {
    headers,
  });
  return res;
};

module.exports = {
  validateCustomer: validateCustomer,
  transferMoney: transferMoney,
  checkTransaction: checkTransaction,
};
