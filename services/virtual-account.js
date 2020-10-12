require("dotenv").config();
const fs = require("fs");
const util = require("../utils/util");
const appRootPath = require("app-root-path");
const axios = require("axios");
const moment = require("moment");
const mongoose = require("mongoose");
const { config } = require(`${appRootPath}/config/config`);
const privateKey = fs.readFileSync(config.baokim.virtualaccount.privatekey);
const publickey = fs.readFileSync(
  config.baokim.virtualaccount.publickey.baokim
);
const PARTNERCODE = config.baokim.virtualaccount.partnercode;
const OPERATION_CREATE = config.baokim.virtualaccount.operation.create; // CREATE VA
const OPERATION_UPDATE = config.baokim.virtualaccount.operation.update; // UPDATE VA
const OPERATION_SEARCH = config.baokim.virtualaccount.operation.search; // SEARCH VA
const OPERATION_TRANSACTION_SEARCH =
  config.baokim.virtualaccount.operation.transaction; // TRANSACTION SEARCH VA
const MONGO_URL = config.mongo.url;
const CREATETYPE = config.baokim.virtualaccount.settings.createtype; // BAOKIM AUTO GENERTATE ACCOUNT NO
const COLLECTION_NAME = "virtualaccount";
const virtualAccountSchema = require("../model/virtual-account");
const { response } = require("../app");
const VirtualAccount = mongoose.model(COLLECTION_NAME, virtualAccountSchema);
var createVirtualAccount = async function (
  accountName,
  amountMin,
  amountMax,
  expireDate
) {
  let requestId = `BK${moment().format("x")}${Math.random(100)}`;
  let requestTime = moment().format("YYYY-MM-DD HH:mm:ss");
  let orderId = `OD${moment().format("YYYYMMDDHHmmss")}`;

  let requestBody = {
    RequestId: requestId,
    RequestTime: requestTime,
    PartnerCode: PARTNERCODE,
    Operation: OPERATION_CREATE,
    CreateType: CREATETYPE,
    AccName: accountName,
    CollectAmountMin: amountMin,
    CollectAmountMax: amountMax,
    OrderId: orderId,
  };
  if (expireDate) requestBody.ExpireDate = expireDate;
  //
  let sign = util.createRSASignature(JSON.stringify(requestBody), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(config.baokim.virtualaccount.url, requestBody, {
    headers,
  });
  console.log(res.data);
  if (res.data) {
    let account = new VirtualAccount({
      requestId: requestId,
      requestTime: requestTime,
      orderId: res.data.OrderId,
      amountMin: res.data.CollectAmountMin,
      amountMax: res.data.CollectAmountMax,
      expireDate: res.data.ExpireDate,
      accountInfo: res.data.AccountInfo,
    });
    mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    let newAccount = await account.save();
    mongoose.disconnect();
    return newAccount;
  }
  return null;
};
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
  };
  if (requestInfo.expireDate) requestBody.ExpireDate = requestInfo.expireDate;
  //
  let sign = util.createRSASignature(JSON.stringify(requestBody), privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  console.log(process.env.NODE_ENV);
  console.log("VA URL", config.baokim.virtualaccount.url);
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
var getVirtualAccount = async (accountNo) => {
  let requestId = `BK${moment().format("x")}${Math.random(100)}`;
  let requestTime = moment().format("YYYY-MM-DD HH:mm:ss");
  let requestInfo = {
    requestId: requestId,
    requestTime: requestTime,
    accountNo: accountNo,
  };
  let response = await retriveVirtualAccount(requestInfo);
  if (response.data || response.data.ResponseCode == 200) {
    console.log(response.data);
    return response.data;
  }
  return null;
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
  createVirtualAccount,
  getVirtualAccount,
  registerVirtualAccount,
  retriveVirtualAccount,
  updateVirtualAccount,
};
