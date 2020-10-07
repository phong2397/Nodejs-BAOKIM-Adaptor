var { v4: uuidv4 } = require("uuid");
var moment = require("moment-timezone");
var express = require("express");
var router = express.Router();
var util = require("../utils/util");
var fs = require("fs");
var baokim = require("../services/virtual-account");
var appRootPath = require("app-root-path");
const { config } = require(`${appRootPath}/config/config`);
const privateKey = fs.readFileSync(config.baokim.virtualaccount.privatekey);
const publickey = fs.readFileSync(config.baokim.virtualaccount.publickey.sfg);
var baoKimPublicKey = fs.readFileSync(
  config.baokim.virtualaccount.publickey.baokim
);
const MESSAGE = {
  ACCOUNT_INVALID: {
    ResponseCode: 111,
    ResponseMessage: "AccNo is incorrect",
  },
  ACCOUNT_NOT_EXIST: {
    ResponseCode: 112,
    ResponseMessage: "AccNo is not exist",
  },
  PROCESS_FAILED: {
    ResponseCode: 120,
    ResponseMessage: "Signature is incorrect",
  },
  SIGNATURE_INVALID: {
    ResponseCode: 120,
    ResponseMessage: "Signature is incorrect",
  },
};

router.post("/collectatpoint", async function (req, res, next) {
  let requestInfo = {
    RequestId: req.body.RequestId,
    RequestTime: req.body.RequestTime,
    PartnerCode: req.body.PartnerCode,
    AccNo: req.body.AccNo,
    Signature: req.body.Signature,
  };
  let rawRequestInfo = `${requestInfo.RequestId}|${requestInfo.RequestTime}|${requestInfo.PartnerCode}|${requestInfo.AccNo}`;
  let checkSignature = util.baokimVerifySignature(
    rawRequestInfo,
    requestInfo.Signature,
    baoKimPublicKey
  );
  let accountNo = requestInfo.AccNo;
  let requestSearch = {
    requestId: `BK${moment().tz("Asia/Ho_Chi_Minh").format("x")}${Math.random(
      100
    )}`,
    requestTime: moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss"),
    accountNo: accountNo,
  };
  if (!requestInfo.Signature || !checkSignature) {
    return res.status(200).json(MESSAGE.SIGNATURE_INVALID);
  }
  if (!accountNo) {
    return res.status(200).json(MESSAGE.ACCOUNT_INVALID);
  }

  //Collect data from database
  let responseSearch = await baokim.retriveVirtualAccount(requestSearch);
  if (!responseSearch.data) {
    return res.status(200).json(MESSAGE.PROCESS_FAILED);
  }
  if (responseSearch.data.ResponseCode != 200) {
    return res.status(200).json(MESSAGE.ACCOUNT_NOT_EXIST);
  }

  let collectAmount = "100000";
  let responseData = {
    ResponseCode: 200,
    ResponseMessage: "Success",
    AccNo: responseSearch.data.AccNo,
    AccName: responseSearch.data.AccName,
    ClientIdNo: responseSearch.data.AccNo,
    OrderId: responseSearch.data.OrderId,
    ExpireDate: responseSearch.data.ExpirDate,
    CollectAmount: collectAmount,
    CollectAmountMin: responseSearch.data.CollectAmountMin,
    CollectAmountMax: responseSearch.data.CollectAmountMax,
    Info: {},
  };
  let rawSignature = `${responseData.ResponseCode}|${responseData.ResponseMessage}|${responseData.AccNo}|${responseData.AccName}|${responseData.ClientIdNo}|${responseData.OrderId}|${responseData.ExpireDate}|${responseData.CollectAmount}|${responseData.CollectAmountMin}|${responseData.CollectAmountMax}`;
  let signature = util.createRSASignature(rawSignature, privateKey);
  responseData.Signature = signature;
  return res.status(200).json(responseData);
});
router.post("/transaction", function (req, res, next) {
  let requestInfo = {
    RequestId: req.body.RequestId,
    RequestTime: req.body.RequestTime,
    PartnerCode: req.body.PartnerCode,
    AccNo: req.body.AccNo,
    ClientIdNo: req.body.ClientIdNo,
    TransId: req.body.TransId,
    TransAmount: req.body.TransAmount,
    TransTime: req.body.TransTime,
    BefTransDebt: req.body.BefTransDebt,
    AffTransDebt: req.body.AffTransDebt,
    AccountType: req.body.AccountType,
    OrderId: req.body.OrderId,
    Signature: req.body.Signature,
  };
  //Sandbox test - required field - BK request null
  requestInfo.ClientIdNo = requestInfo.ClientIdNo ? requestInfo.ClientIdNo : "";
  let dataFromRequest = `${requestInfo.RequestId}|${requestInfo.RequestTime}|${requestInfo.PartnerCode}|${requestInfo.AccNo}|${requestInfo.ClientIdNo}|${requestInfo.TransId}|${requestInfo.TransAmount}|${requestInfo.TransTime}|${requestInfo.BefTransDebt}|${requestInfo.AffTransDebt}|${requestInfo.AccountType}|${requestInfo.OrderId}`;
  let checkSignature = util.baokimVerifySignature(
    dataFromRequest,
    requestInfo.Signature,
    baoKimPublicKey
  );
  if (!requestInfo.Signature || !checkSignature) {
    return res.status(200).json(MESSAGE.SIGNATURE_INVALID);
  }
  // Verify Signature
  let responseCode = 200;
  let responseMessage = "Success";
  let referenceId = `${requestInfo.PartnerCode}${uuidv4()}`;
  let accNo = requestInfo.AccNo;
  let affTransDebt = requestInfo.AffTransDebt;
  let rawData = `${responseCode}|${responseMessage}|${referenceId}|${accNo}|${affTransDebt}`;
  let signature = util.createRSASignature(rawData, privateKey);

  return res.status(200).json({
    ResponseCode: responseCode,
    ResponseMessage: responseMessage,
    ReferenceId: referenceId,
    AccNo: accNo,
    AffTransDebt: affTransDebt,
    Signature: signature,
  });
});
router.post("/bankswitch", function (req, res, next) {
  let requestInfo = {
    RequestId: req.body.RequestId,
    RequestTime: req.body.RequestTime,
    PartnerCode: req.body.PartnerCode,
    AccName: req.body.AccName,
    AccNo: req.body.AccNo,
    ExpireDate: req.body.ExpireDate,
    OrderId: req.body.OrderId,
    BankSortName: req.body.BankSortName,
  };
  let Signature = req.headers.signature;
  let checkSignature = util.baokimVerifySignature(
    JSON.stringify(requestInfo),
    Signature,
    baoKimPublicKey
  );
  //Check Signature
  if (!Signature || !checkSignature) {
    return res.status(200).json(MESSAGE.SIGNATURE_INVALID);
  }
  let responseInfo = {
    ResponseCode: 200,
    ResponseMessage: "Success",
    AccNo: requestInfo.AccNo,
  };
  let signatureRes = util.createRSASignature(
    JSON.stringify(responseInfo),
    privateKey
  );
  responseInfo.Signature = signatureRes;
  return res.status(200).json(responseInfo);
});
module.exports = router;
