"use strict";

var request = require("request");

var moment = require("moment-timezone");

var date = require("date-and-time");

var crypto = require("crypto");

var fs = require("fs");

var appRootPath = require("app-root-path");

var _require = require("".concat(appRootPath, "/config/config")),
    config = _require.config;

var PARTNERCODE = config.baokim.disbursement.partnercode;
var data = JSON.parse(fs.readFileSync(config.baokim.disbursement.data));
var privateKey = fs.readFileSync(config.baokim.disbursement.privatekey);
var publicKey = fs.readFileSync(config.baokim.disbursement.publickey);
var TIMEZONE_VN = "Asia/Ho_Chi_Minh";

var randomInteger = function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function createSignature(requestText, privateKey) {
  var sign = crypto.createSign("RSA-SHA1");
  sign.update(requestText);
  sign.end();
  var signature = sign.sign(privateKey, "base64");
  return signature;
}

function verifySignature(responseText, signature, publicKey) {
  var verify = crypto.createVerify("RSA-SHA1");
  verify.update(responseText);
  verify.end();
  return verify.verify(publicKey, Buffer.from(signature, "base64"));
}

function sendToPaymentgateway(url, reqData) {
  console.log("Request: ", url);
  console.log("Request Data: ", reqData);
  return new Promise(function (resolve, reject) {
    request({
      url: url,
      method: "POST",
      json: reqData
    }, function (error, response, responseData) {
      if (error) {
        reject(error);
      } else {
        resolve(responseData);
      }
    });
  });
}

function setCheckUserInfoData(requestData) {
  var now = new Date();
  var timeRequest = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
  var id = "BK".concat(moment().tz(TIMEZONE_VN).format("YYYYMMDD")).concat(randomInteger(100, 999));
  var bankno = requestData.BankNo;
  var accno = requestData.AccNo;
  var dataSign = "".concat(id, "|").concat(timeRequest, "|").concat(data.CheckUserInfomation.PartnerCode, "|").concat(data.CheckUserInfomation.Operation, "|").concat(bankno, "|").concat(accno, "|").concat(data.CheckUserInfomation.AccType);
  data.CheckUserInfomation.RequestId = id;
  data.CheckUserInfomation.RequestTime = timeRequest;
  data.CheckUserInfomation.PartnerCode = PARTNERCODE;
  data.CheckUserInfomation.BankNo = bankno;
  data.CheckUserInfomation.AccNo = accno;
  console.log("rawData: ", dataSign);
  data.CheckUserInfomation.Signature = createSignature(dataSign, privateKey);
  return data.CheckUserInfomation;
}

function setTransfer(requestData) {
  var now = new Date();
  var timeRequest = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
  var id = "BK".concat(moment().tz(TIMEZONE_VN).format("YYYYMMDD")).concat(randomInteger(100, 999));
  Math.floor(Math.random() * Math.floor(9));
  var referenceId = id + Math.floor(Math.random() * Math.floor(99));
  var bankno = requestData.BankNo;
  var accno = requestData.AccNo;
  var requestamount = requestData.RequestAmount;
  var memo = requestData.Memo;
  var dataSign = "".concat(id, "|").concat(timeRequest, "|").concat(data.MoneyTransfer.PartnerCode, "|").concat(data.MoneyTransfer.Operation, "|").concat(referenceId, "|").concat(bankno, "|").concat(accno, "|").concat(data.MoneyTransfer.AccType, "|").concat(requestamount, "|").concat(memo);
  data.MoneyTransfer.RequestId = id;
  data.MoneyTransfer.RequestTime = timeRequest;
  data.MoneyTransfer.ReferenceId = referenceId;
  data.MoneyTransfer.PartnerCode = PARTNERCODE;
  data.MoneyTransfer.BankNo = bankno;
  data.MoneyTransfer.AccNo = accno;
  data.MoneyTransfer.RequestAmount = requestamount;
  data.MoneyTransfer.Memo = memo;
  data.MoneyTransfer.Signature = createSignature(dataSign, privateKey);
  return data.MoneyTransfer;
}

function setCheckTransStatus(requestData) {
  var now = new Date();
  var timeRequest = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
  var id = "BK".concat(moment().tz(TIMEZONE_VN).format("YYYYMMDD")).concat(randomInteger(100, 999));
  var refid = requestData.ReferenceId;
  var dataSign = "".concat(id, "|").concat(timeRequest, "|").concat(data.CheckTransactionStatus.PartnerCode, "|").concat(data.CheckTransactionStatus.Operation, "|").concat(refid);
  data.CheckTransactionStatus.RequestId = id;
  data.CheckTransactionStatus.RequestTime = timeRequest;
  data.CheckTransactionStatus.PartnerCode = PARTNERCODE;
  data.CheckTransactionStatus.ReferenceId = refid;
  data.CheckTransactionStatus.Signature = createSignature(dataSign, privateKey);
  return data.CheckTransactionStatus;
}

module.exports = {
  sendToPaymentgateway: sendToPaymentgateway,
  setCheckUserInfoData: setCheckUserInfoData,
  setTransfer: setTransfer,
  setCheckTransStatus: setCheckTransStatus
};