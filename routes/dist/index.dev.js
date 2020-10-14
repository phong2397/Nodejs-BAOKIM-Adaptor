"use strict";

var _require = require("uuid"),
    uuidv4 = _require.v4;

var moment = require("moment-timezone");

var express = require("express");

var router = express.Router();

var util = require("../utils/util");

var fs = require("fs");

var baokim = require("../services/virtual-account");

var appRootPath = require("app-root-path");

var _require2 = require("".concat(appRootPath, "/config/config")),
    config = _require2.config;

var privateKey = fs.readFileSync(config.baokim.privatekey);
var baoKimPublicKey = fs.readFileSync(config.baokim.publickeyBaokim);
var MESSAGE = {
  ACCOUNT_INVALID: {
    ResponseCode: 111,
    ResponseMessage: "AccNo is incorrect"
  },
  ACCOUNT_NOT_EXIST: {
    ResponseCode: 112,
    ResponseMessage: "AccNo is not exist"
  },
  PROCESS_FAILED: {
    ResponseCode: 120,
    ResponseMessage: "Signature is incorrect"
  },
  SIGNATURE_INVALID: {
    ResponseCode: 120,
    ResponseMessage: "Signature is incorrect"
  }
};
router.post("/collectatpoint", function _callee(req, res, next) {
  var requestInfo, rawRequestInfo, checkSignature, accountNo, requestSearch, responseSearch, collectAmount, responseData, rawSignature, signature;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requestInfo = {
            RequestId: req.body.RequestId,
            RequestTime: req.body.RequestTime,
            PartnerCode: req.body.PartnerCode,
            AccNo: req.body.AccNo,
            Signature: req.body.Signature
          };
          rawRequestInfo = "".concat(requestInfo.RequestId, "|").concat(requestInfo.RequestTime, "|").concat(requestInfo.PartnerCode, "|").concat(requestInfo.AccNo);
          checkSignature = util.baokimVerifySignature(rawRequestInfo, requestInfo.Signature, baoKimPublicKey);
          accountNo = requestInfo.AccNo;
          requestSearch = {
            requestId: "BK".concat(moment().tz("Asia/Ho_Chi_Minh").format("x")).concat(Math.random(100)),
            requestTime: moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss"),
            accountNo: accountNo
          };

          if (!(!requestInfo.Signature || !checkSignature)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(200).json(MESSAGE.SIGNATURE_INVALID));

        case 7:
          if (accountNo) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(200).json(MESSAGE.ACCOUNT_INVALID));

        case 9:
          _context.next = 11;
          return regeneratorRuntime.awrap(baokim.retriveVirtualAccount(requestSearch));

        case 11:
          responseSearch = _context.sent;

          if (responseSearch.data) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(200).json(MESSAGE.PROCESS_FAILED));

        case 14:
          if (!(responseSearch.data.ResponseCode != 200)) {
            _context.next = 16;
            break;
          }

          return _context.abrupt("return", res.status(200).json(MESSAGE.ACCOUNT_NOT_EXIST));

        case 16:
          collectAmount = "100000";
          responseData = {
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
            Info: {}
          };
          rawSignature = "".concat(responseData.ResponseCode, "|").concat(responseData.ResponseMessage, "|").concat(responseData.AccNo, "|").concat(responseData.AccName, "|").concat(responseData.ClientIdNo, "|").concat(responseData.OrderId, "|").concat(responseData.ExpireDate, "|").concat(responseData.CollectAmount, "|").concat(responseData.CollectAmountMin, "|").concat(responseData.CollectAmountMax);
          signature = util.createRSASignature(rawSignature, privateKey);
          responseData.Signature = signature;
          return _context.abrupt("return", res.status(200).json(responseData));

        case 22:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post("/transaction", function (req, res, next) {
  var requestInfo = {
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
    Signature: req.body.Signature
  }; //Sandbox test - required field - BK request null

  requestInfo.ClientIdNo = requestInfo.ClientIdNo ? requestInfo.ClientIdNo : "";
  var dataFromRequest = "".concat(requestInfo.RequestId, "|").concat(requestInfo.RequestTime, "|").concat(requestInfo.PartnerCode, "|").concat(requestInfo.AccNo, "|").concat(requestInfo.ClientIdNo, "|").concat(requestInfo.TransId, "|").concat(requestInfo.TransAmount, "|").concat(requestInfo.TransTime, "|").concat(requestInfo.BefTransDebt, "|").concat(requestInfo.AffTransDebt, "|").concat(requestInfo.AccountType, "|").concat(requestInfo.OrderId);
  var checkSignature = util.baokimVerifySignature(dataFromRequest, requestInfo.Signature, baoKimPublicKey);

  if (!requestInfo.Signature || !checkSignature) {
    return res.status(200).json(MESSAGE.SIGNATURE_INVALID);
  } // Verify Signature


  var responseCode = 200;
  var responseMessage = "Success";
  var referenceId = "".concat(requestInfo.PartnerCode).concat(uuidv4());
  var accNo = requestInfo.AccNo;
  var affTransDebt = requestInfo.AffTransDebt;
  var rawData = "".concat(responseCode, "|").concat(responseMessage, "|").concat(referenceId, "|").concat(accNo, "|").concat(affTransDebt);
  var signature = util.createRSASignature(rawData, privateKey);
  return res.status(200).json({
    ResponseCode: responseCode,
    ResponseMessage: responseMessage,
    ReferenceId: referenceId,
    AccNo: accNo,
    AffTransDebt: affTransDebt,
    Signature: signature
  });
});
router.post("/bankswitch", function (req, res, next) {
  var requestInfo = {
    RequestId: req.body.RequestId,
    RequestTime: req.body.RequestTime,
    PartnerCode: req.body.PartnerCode,
    AccName: req.body.AccName,
    AccNo: req.body.AccNo,
    ExpireDate: req.body.ExpireDate,
    OrderId: req.body.OrderId,
    BankShortName: req.body.BankShortName
  };
  var Signature = req.headers.signature;
  var checkSignature = util.baokimVerifySignature(JSON.stringify(requestInfo), Signature, baoKimPublicKey); //Check Signature

  if (!Signature || !checkSignature) {
    return res.status(200).json(MESSAGE.SIGNATURE_INVALID);
  }

  var responseInfo = {
    ResponseCode: 200,
    ResponseMessage: "Success",
    AccNo: requestInfo.AccNo
  };
  var signatureRes = util.createRSASignature(JSON.stringify(responseInfo), privateKey);
  responseInfo.Signature = signatureRes;
  return res.status(200).json(responseInfo);
});
module.exports = router;