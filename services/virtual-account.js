require("dotenv").config();
const fs = require("fs");
const util = require("../utils/util");
const { requestFactory } = require("../utils/baokim/baokim-utils");
const appRootPath = require("app-root-path");
const axios = require("axios");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const { config } = require(`${appRootPath}/config/config`);
const privateKey = fs.readFileSync(config.baokim.privatekey);
const PARTNERCODE = config.baokim.virtualaccount.partnercode;
const OPERATION_CREATE = config.baokim.virtualaccount.operation.create; // CREATE VA
const OPERATION_UPDATE = config.baokim.virtualaccount.operation.update; // UPDATE VA
const OPERATION_SEARCH = config.baokim.virtualaccount.operation.search; // SEARCH VA
const OPERATION_TRANSACTION_SEARCH =
  config.baokim.virtualaccount.operation.transaction; // TRANSACTION SEARCH VA
const MONGO_URL = config.mongo.url;
const CREATETYPE = config.baokim.virtualaccount.settings.createtype; // BAOKIM AUTO GENERTATE ACCOUNT NO
const COLLECT_URL = config.baokim.collectionUrl;
var randomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var createVirtualAccount = async function (
  accName,
  amountMin,
  amountMax,
  expireDate,
) {
  let requestInfo = new requestFactory().createRequestInfo(
    "virtualaccount",
    OPERATION_CREATE,
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
    Operation: OPERATION_CREATE,
    CreateType: CREATETYPE,
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
    OPERATION_UPDATE,
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
//TODO: FIX SAME
var getVirtualAccount = async function (accNo) {
  let requestInfo = new requestFactory().createRequestInfo(
    "virtualaccount",
    OPERATION_SEARCH,
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
//TODO: FIX SAME
var retriveVirtualAccount = async function (accNo) {
  let requestInfo = new requestFactory().createRequestInfo(
    "virtualaccount",
    OPERATION_SEARCH,
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
