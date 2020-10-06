require("dotenv").config();
var fs = require("fs");
var util = require("../utils/util");
var appRootPath = require("app-root-path");
var axios = require("axios");
var { config } = require(`${appRootPath}/config/config`);
var privateKey = fs.readFileSync(`${appRootPath}/keyRSA/private.pem`);
var publickey = fs.readFileSync(`${appRootPath}/keyRSA/public.pem`);
const PARTNERCODE = "VAYSV";
const OPERATION_CREATE = 9001; // CREATE VA
const OPERATION_UPDATE = 9002; // UPDATE VA
const OPERATION_SEARCH = 9003; // SEARCH VA
const OPERATION_TRANSACTION_SEARCH = 9004; // TRANSACTION SEARCH VA
const CREATETYPE = 2; // BAOKIM AUTO GENERTATE ACCOUNT NO

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
  let res = await axios.post(config.baokim.url, requestBody, { headers });
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
  let res = await axios.post(config.baokim.url, requestBody, { headers });
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
  let res = await axios.post(config.baokim.url, requestBody, { headers });
  return res;
};

module.exports = {
  registerVirtualAccount,
  retriveVirtualAccount,
  updateVirtualAccount,
};
