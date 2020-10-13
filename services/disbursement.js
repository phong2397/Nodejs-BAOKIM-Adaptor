const request = require("request");
const moment = require("moment-timezone");
const date = require("date-and-time");
const crypto = require("crypto");
const fs = require("fs");
const appRootPath = require("app-root-path");
const { config } = require(`${appRootPath}/config/config`);
const PARTNERCODE = config.baokim.disbursement.partnercode;
const data = JSON.parse(fs.readFileSync(config.baokim.disbursement.data));
const privateKey = fs.readFileSync(config.baokim.disbursement.privatekey);
const publicKey = fs.readFileSync(config.baokim.disbursement.publickey);
const TIMEZONE_VN = "Asia/Ho_Chi_Minh";
var randomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
function createSignature(requestText, privateKey) {
  const sign = crypto.createSign("RSA-SHA1");
  sign.update(requestText);
  sign.end();
  const signature = sign.sign(privateKey, "base64");
  return signature;
}

function verifySignature(responseText, signature, publicKey) {
  const verify = crypto.createVerify("RSA-SHA1");
  verify.update(responseText);
  verify.end();
  return verify.verify(publicKey, Buffer.from(signature, "base64"));
}

function sendToPaymentgateway(url, reqData) {
  console.log("Request: ", url);
  console.log("Request Data: ", reqData);
  return new Promise(function (resolve, reject) {
    request(
      {
        url: url,
        method: "POST",
        json: reqData,
      },
      function (error, response, responseData) {
        if (error) {
          reject(error);
        } else {
          resolve(responseData);
        }
      }
    );
  });
}

function setCheckUserInfoData(requestData) {
  let now = new Date();
  let timeRequest = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
  let id = `BK${moment().tz(TIMEZONE_VN).format("YYYYMMDD")}${randomInteger(
    100,
    999
  )}`;
  let bankno = requestData.BankNo;
  let accno = requestData.AccNo;
  let dataSign = `${id}|${timeRequest}|${data.CheckUserInfomation.PartnerCode}|${data.CheckUserInfomation.Operation}|${bankno}|${accno}|${data.CheckUserInfomation.AccType}`;
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
  let now = new Date();
  let timeRequest = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
  let id = `BK${moment().tz(TIMEZONE_VN).format("YYYYMMDD")}${randomInteger(
    100,
    999
  )}`;
  Math.floor(Math.random() * Math.floor(9));
  let referenceId = id + Math.floor(Math.random() * Math.floor(99));
  let bankno = requestData.BankNo;
  let accno = requestData.AccNo;
  let requestamount = requestData.RequestAmount;
  let memo = requestData.Memo;

  const dataSign = `${id}|${timeRequest}|${data.MoneyTransfer.PartnerCode}|${data.MoneyTransfer.Operation}|${referenceId}|${bankno}|${accno}|${data.MoneyTransfer.AccType}|${requestamount}|${memo}`;

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
  const now = new Date();
  let timeRequest = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
  let id = `BK${moment().tz(TIMEZONE_VN).format("YYYYMMDD")}${randomInteger(
    100,
    999
  )}`;
  var refid = requestData.ReferenceId;

  const dataSign = `${id}|${timeRequest}|${data.CheckTransactionStatus.PartnerCode}|${data.CheckTransactionStatus.Operation}|${refid}`;

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
  setCheckTransStatus: setCheckTransStatus,
};
