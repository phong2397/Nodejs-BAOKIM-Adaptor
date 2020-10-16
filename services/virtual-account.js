require("dotenv").config();
const fs = require("fs");
const util = require("../utils/util");
const { requestFactory } = require("../utils/baokim/baokim-utils");
const appRootPath = require("app-root-path");
const axios = require("axios");
const { config } = require(`${appRootPath}/config/config`);
const privateKey = fs.readFileSync(config.baokim.privatekey);
const PARTNERCODE = config.baokim.virtualaccount.partnercode;
const { VIRTUALACCOUNT } = require("../utils/enum/enum");
const COLLECT_URL = config.baokim.collectionUrl;

var createVirtualAccount = async function (
  accName,
  amountMin,
  amountMax,
  expireDate,
) {
  let requestInfo = new requestFactory().createRequestInfo(
    "virtualaccount",
    VIRTUALACCOUNT.CREATE,
    {
      accName,
      amountMin,
      amountMax,
      expireDate,
    },
  );
  let sign = util.createRSASignature(JSON.stringify(requestInfo), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(COLLECT_URL, requestInfo, {
    headers,
  });
  return res;
};
//TODO: Need replace - Test
var registerVirtualAccount = async function (requestInfo) {
  let requestBody = {
    RequestId: requestInfo.requestId,
    RequestTime: requestInfo.requestTime,
    PartnerCode: PARTNERCODE,
    Operation: VIRTUALACCOUNT.CREATE,
    CreateType: VIRTUALACCOUNT.CREATETYPE,
    AccName: requestInfo.accountName,
    CollectAmountMin: requestInfo.amountMin,
    CollectAmountMax: requestInfo.amountMax,
    OrderId: requestInfo.orderId,
  };
  if (requestInfo.expireDate) requestBody.ExpireDate = requestInfo.expireDate;
  //
  let rawData = JSON.stringify(requestBody);
  // console.log(rawData);
  let sign = util.createRSASignature(rawData, privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(COLLECT_URL, requestBody, {
    headers,
  });
  return res;
};
var updateVirtualAccount = async function (
  accNo,
  accName,
  amountMin,
  amountMax,
  expireDate,
) {
  let requestInfo = new requestFactory().createRequestInfo(
    "virtualaccount",
    VIRTUALACCOUNT.UPDATE,
    { accNo, accName, amountMin, amountMax, expireDate },
  );
  //Send to baokim
  let sign = util.createRSASignature(JSON.stringify(requestInfo), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(COLLECT_URL, requestInfo, {
    headers,
  });
  return res;
};
//TODO: FIX SAME v
var getVirtualAccount = async function (accNo) {
  let requestInfo = new requestFactory().createRequestInfo(
    "virtualaccount",
    VIRTUALACCOUNT.SEARCH,
    { accNo },
  );
  let sign = util.createRSASignature(JSON.stringify(requestInfo), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(COLLECT_URL, requestInfo, {
    headers,
  });
  return res;
};
//TODO: FIX SAME ^
var retriveVirtualAccount = async function (accNo) {
  let requestInfo = new requestFactory().createRequestInfo(
    "virtualaccount",
    VIRTUALACCOUNT.SEARCH,
    { accNo },
  );
  let sign = util.createRSASignature(JSON.stringify(requestInfo), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(COLLECT_URL, requestInfo, {
    headers,
  });
  return res;
};

module.exports = {
  createVirtualAccount,
  getVirtualAccount,
  registerVirtualAccount,
  retriveVirtualAccount,
  updateVirtualAccount,
};
