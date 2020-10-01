var { v4: uuidv4 } = require("uuid");
var express = require("express");
var router = express.Router();
var util = require("../utils/util");
var fs = require("fs");
// var logger = require("../utils/winston/winston");
var logger = require("../utils/winston/winston")("BAOKIM-LISTENER");
var appRootPath = require("app-root-path");
var privateKey = fs.readFileSync(`${appRootPath}/keyRSA/private.pem`);
var publickey = fs.readFileSync(`${appRootPath}/keyRSA/public.pem`);
var baoKimPublicKey = fs.readFileSync(
  `${appRootPath}/keyRSA/baokim/public.pem`
);

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.post("/notify", function (req, res, next) {
  let requestInfo = req.body;
  //check
  logger.info("webhook" + JSON.stringify(requestInfo));
  return res.status(200).json({ err_code: "0", message: "recieved" });
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
  //Verify Signature
  // if (!checkSignature)
  //   return res.status(200).json({
  //     ResponseCode: 120,
  //     ResponseMessage: "Signature is incorrect",
  //   });
  let responseCode = 200;
  let responseMessage = "Success";
  let referenceId = `${requestInfo.PartnerCode}${uuidv4()}`;
  let accNo = requestInfo.AccNo;
  let affTransDebt = requestInfo.AffTransDebt;
  let rawData = `${responseCode}|${responseMessage}|${referenceId}|${accNo}|${affTransDebt}`;
  let signature = util.createRSSAignature(rawData, privateKey);
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
  let Signature = request.headers.Signature;
  if (Signature)
    return res.status(200).json({
      ResponseCode: 120,
      ResponseMessage: "Signature is incorrect",
    });
  let responseInfo = {
    ResponseCode: 200,
    ResponseMessage: "Success",
    AccNo: requestInfo.AccNo,
  };
  let signatureRes = util.createRSSAignature(
    JSON.stringify(responseInfo),
    privateKey
  );
  responseInfo.Signature = signatureRes;
  return res.status(200).json(responseInfo);
});
module.exports = router;
