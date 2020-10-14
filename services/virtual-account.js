require("dotenv").config();
const fs = require("fs");
const util = require("../utils/util");
const { requestFactory } = require("../utils/baokim/baokim-utils");
const appRootPath = require("app-root-path");
const axios = require("axios");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const { config } = require(`${appRootPath}/config/config`);
const privateKey = fs.readFileSync(config.baokim.virtualaccount.privatekey);
const publickey = fs.readFileSync(
  config.baokim.virtualaccount.publickey.baokim,
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
const virtualAccountSchema = require("virtual-account");
const VirtualAccount = mongoose.model(COLLECTION_NAME, virtualAccountSchema);
const TIMEZONE_VN = "Asia/Ho_Chi_Minh";
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
  let sign = util.createRSASignature(rawData, privateKey);
  let headers = {
    "Content-Type": "application/json",
    Signature: `${sign}`,
  };
  let res = await axios.post(config.baokim.virtualaccount.url, requestInfo, {
    headers,
  });

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
var registerVirtualAccount = async requestInfo => {
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
  let res = await axios.post(config.baokim.virtualaccount.url, requestBody, {
    headers,
  });
  return res;
};
var updateVirtualAccount = async requestInfo => {
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
var getVirtualAccount = async accountNo => {
  let requestId = `BK${moment()
    .tz(TIMEZONE_VN)
    .format("YYYYMMDD")}${randomInteger(100, 999)}`;
  let requestTime = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
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
var retriveVirtualAccount = async requestInfo => {
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
