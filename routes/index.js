var { v4: uuidv4 } = require("uuid");
var moment = require("moment");
var express = require("express");
var router = express.Router();
var util = require("../utils/util");
var fs = require("fs");
var baokim = require("../services/baokim");
var logger = require("../utils/winston/winston")("BAOKIM-LISTENER");
var appRootPath = require("app-root-path");
const { request } = require("express");
var privateKey = fs.readFileSync(`${appRootPath}/keyRSA/private.pem`);
var publickey = fs.readFileSync(`${appRootPath}/keyRSA/public.pem`);
var baoKimPublicKey = fs.readFileSync(
  `${appRootPath}/keyRSA/baokim/public.pem`
);
router.post("/notify", function (req, res, next) {
  let requestInfo = req.body;
  //check
  logger.info("webhook" + JSON.stringify(requestInfo));
  return res.status(200).json({ err_code: "0", message: "recieved" });
});
router.post("/collectAtPoint", async function (req, res, next) {
  let requestInfo = {
    RequestId: req.body.RequestId,
    RequestTime: req.body.RequestTime,
    PartnerCode: req.body.PartnerCode,
    AccNo: req.body.AccNo,
    Signature: req.body.Signature,
  };
  if (!requestInfo.Signature) {
    return res.status(200).json({
      ResponseCode: 120,
      ResponseMessage: "Signature is incorrect",
    });
  }
  let rawRequestInfo = `${requestInfo.RequestId}|${requestInfo.RequestTime}|${requestInfo.PartnerCode}|${requestInfo.AccNo}`;
  let checkSignature = util.baokimVerifySignature(
    rawRequestInfo,
    requestInfo.Signature,
    baoKimPublicKey
  );
  if (!checkSignature) {
    return res.status(200).json({
      ResponseCode: 120,
      ResponseMessage: "Signature is incorrect",
    });
  }
  let accountNo = requestInfo.AccNo;
  if (!accountNo) {
    //111 AccNo is incorrect
    return res.status(200).json({
      ResponseCode: 111,
      ResponseMessage: "AccNo is incorrect",
    });
  }
  let requestSearch = {
    requestId: `BK${moment().format("x")}${Math.random(100)}`,
    requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    accountNo: accountNo,
  };
  //Collect data from database
  let responseSearch = await baokim.retriveVirtualAccount(requestSearch);
  if (!responseSearch.data) {
    // 101 	Error processing from Baokim
    return res.status(200).json({
      ResponseCode: 11,
      ResponseMessage: "Failed",
    });
  }
  if (responseSearch.data.ResponseCode != 200) {
    // 112 	AccNo is not exist
    return res.status(200).json({
      ResponseCode: 112,
      ResponseMessage: "AccNo is not exist",
    });
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
router.post("/notifyCollection", function (req, res, next) {
  // console.log(req.body);
  logger.info("collection: " + JSON.stringify(req.body));
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
  if (!requestInfo.Signature)
    return res.status(200).json({
      ResponseCode: 120,
      ResponseMessage: "Signature is incorrect",
    });
  let checkSignature = util.baokimVerifySignature(
    dataFromRequest,
    requestInfo.Signature,
    baoKimPublicKey
  );
  // Verify Signature
  if (!checkSignature)
    return res.status(200).json({
      ResponseCode: 120,
      ResponseMessage: "Signature is incorrect",
    });
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
router.post("/notifyBankSwitch", function (req, res, next) {
  logger.info("bankswitch: " + JSON.stringify(req.body));
  let requestInfo = {
    RequestId: req.body.RequestId,
    RequestTime: req.body.RequestTime,
    PartnerCode: req.body.PartnerCode,
    AccName: req.body.AccName,
    AccNo: req.body.AccNo,
    ExpirDate: req.body.ExpirDate,
    OrderId: req.body.OrderId,
    BankSortName: req.body.BankSortName,
  };
  let Signature = req.headers.Signature;
  if (!Signature) {
    return res.status(200).json({
      ResponseCode: 120,
      ResponseMessage: "Signature is incorrect",
    });
  }
  let checkSignature = util.baokimVerifySignature(
    dataFromRequest,
    requestInfo.Signature,
    baoKimPublicKey
  );
  // Verify Signature
  if (!checkSignature) {
    return res.status(200).json({
      ResponseCode: 120,
      ResponseMessage: "Signature is incorrect",
    });
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
