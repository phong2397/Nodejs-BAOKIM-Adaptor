require("dotenv").config();
const fs = require("fs");
const util = require("../utils/util");
const appRootPath = require("app-root-path");
const axios = require("axios");
const { config } = require(`${appRootPath}/config/config`);
const privateKey = fs.readFileSync(`${appRootPath}/key/private.pem`);
const publickey = fs.readFileSync(`${appRootPath}/key/public.pem`);
const PARTNERCODE = config.baokim.virtualaccount.partnercode;
const OPERATION_CREATE = config.baokim.virtualaccount.operation.create; // CREATE VA
const OPERATION_UPDATE = config.baokim.virtualaccount.operation.update; // UPDATE VA
const OPERATION_SEARCH = config.baokim.virtualaccount.operation.search; // SEARCH VA
const OPERATION_TRANSACTION_SEARCH =
  config.baokim.virtualaccount.operation.transaction; // TRANSACTION SEARCH VA
const CREATETYPE = config.baokim.virtualaccount.settings.createtype; // BAOKIM AUTO GENERTATE ACCOUNT NO

var registerVirtualAccount = async (requestInfo) => {
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
    AccNo: requestInfo.accountNo,
  };
  if (requestInfo.expireDate) requestBody.ExpireDate = requestInfo.expireDate;
  //
  let sign = util.createRSASignature(JSON.stringify(requestBody), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(config.baokim.virtualaccount.url, requestBody, {
    headers,
  });
  return res;
};
var updateVirtualAccount = async (requestInfo) => {
  let requestBody = {
    RequestId: requestInfo.requestId,
    RequestTime: requestInfo.requestTime,
    PartnerCode: PARTNERCODE,
    Operation: OPERATION_UPDATE,
    CreateType: CREATETYPE,
    AccName: requestInfo.accountName,
    OrderId: requestInfo.orderId,
    AccNo: requestInfo.accountNo,
  };
  if (requestInfo.expireDate) requestBody.ExpireDate = requestInfo.expireDate;
  if (requestInfo.amountMin)
    requestBody.CollectAmountMin = requestInfo.amountMin;
  if (requestInfo.amountMax)
    requestBody.CollectAmountMax = requestInfo.amountMax;
  if (requestInfo.accountName) requestBody.AccName = requestInfo.accountName;
  //
  let sign = util.createRSASignature(JSON.stringify(requestBody), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(config.baokim.virtualaccount.url, requestBody, {
    headers,
  });
  return res;
};
var retriveVirtualAccount = async (requestInfo) => {
  let requestBody = {
    RequestId: requestInfo.requestId,
    RequestTime: requestInfo.requestTime,
    PartnerCode: PARTNERCODE,
    Operation: OPERATION_SEARCH,
    AccNo: requestInfo.accountNo,
  };
  let sign = util.createRSASignature(JSON.stringify(requestBody), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(config.baokim.virtualaccount.url, requestBody, {
    headers,
  });
  return res;
};

module.exports = {
  registerVirtualAccount,
  retriveVirtualAccount,
  updateVirtualAccount,
};
