"use strict";

require("dotenv").config();

var fs = require("fs");

var util = require("../utils/util");

var appRootPath = require("app-root-path");

var axios = require("axios");

var moment = require("moment-timezone");

var mongoose = require("mongoose");

var _require = require("".concat(appRootPath, "/config/config")),
    config = _require.config;

var privateKey = fs.readFileSync(config.baokim.virtualaccount.privatekey);
var publickey = fs.readFileSync(config.baokim.virtualaccount.publickey.baokim);
var PARTNERCODE = config.baokim.virtualaccount.partnercode;
var OPERATION_CREATE = config.baokim.virtualaccount.operation.create; // CREATE VA

var OPERATION_UPDATE = config.baokim.virtualaccount.operation.update; // UPDATE VA

var OPERATION_SEARCH = config.baokim.virtualaccount.operation.search; // SEARCH VA

var OPERATION_TRANSACTION_SEARCH = config.baokim.virtualaccount.operation.transaction; // TRANSACTION SEARCH VA

var MONGO_URL = config.mongo.url;
var CREATETYPE = config.baokim.virtualaccount.settings.createtype; // BAOKIM AUTO GENERTATE ACCOUNT NO

var COLLECTION_NAME = "virtualaccount";

var virtualAccountSchema = require("../model/virtual-account");

var _require2 = require("express"),
    raw = _require2.raw;

var VirtualAccount = mongoose.model(COLLECTION_NAME, virtualAccountSchema);
var TIMEZONE_VN = "Asia/Ho_Chi_Minh";

var createVirtualAccount = function createVirtualAccount(accountName, amountMin, amountMax, expireDate) {
  var requestId, requestTime, orderId, requestBody, rawData, sign, headers, res, account, newAccount;
  return regeneratorRuntime.async(function createVirtualAccount$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requestId = "BK".concat(moment().tz(TIMEZONE_VN).format("x")).concat(Math.random(100));
          requestTime = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
          orderId = "OD".concat(moment().format("YYYYMMDDHHmmss"));
          requestBody = {
            RequestId: requestId,
            RequestTime: requestTime,
            PartnerCode: PARTNERCODE,
            Operation: OPERATION_CREATE,
            CreateType: CREATETYPE,
            AccName: accountName,
            CollectAmountMin: amountMin,
            CollectAmountMax: amountMax,
            OrderId: orderId
          };
          if (expireDate) requestBody.ExpireDate = expireDate; //

          rawData = JSON.stringify(requestBody);
          console.log(rawData);
          sign = util.createRSASignature(rawData, privateKey);
          headers = {
            "Content-Type": "application/json",
            Signature: "".concat(sign)
          };
          _context.next = 11;
          return regeneratorRuntime.awrap(axios.post(config.baokim.virtualaccount.url, requestBody, {
            headers: headers
          }));

        case 11:
          res = _context.sent;
          console.log("headers: ", headers);
          console.log("body: ", requestBody);
          console.log(res.data);

          if (!res.data) {
            _context.next = 23;
            break;
          }

          account = new VirtualAccount({
            requestId: requestId,
            requestTime: requestTime,
            orderId: res.data.OrderId,
            amountMin: res.data.CollectAmountMin,
            amountMax: res.data.CollectAmountMax,
            expireDate: res.data.ExpireDate,
            accountInfo: res.data.AccountInfo
          });
          mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
          _context.next = 20;
          return regeneratorRuntime.awrap(account.save());

        case 20:
          newAccount = _context.sent;
          mongoose.disconnect();
          return _context.abrupt("return", newAccount);

        case 23:
          return _context.abrupt("return", null);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  });
};

var registerVirtualAccount = function registerVirtualAccount(requestInfo) {
  var requestBody, rawData, sign, headers, res;
  return regeneratorRuntime.async(function registerVirtualAccount$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          requestBody = {
            RequestId: requestInfo.requestId,
            RequestTime: requestInfo.requestTime,
            PartnerCode: PARTNERCODE,
            Operation: OPERATION_CREATE,
            CreateType: CREATETYPE,
            AccName: requestInfo.accountName,
            CollectAmountMin: requestInfo.amountMin,
            CollectAmountMax: requestInfo.amountMax,
            OrderId: requestInfo.orderId
          };
          if (requestInfo.expireDate) requestBody.ExpireDate = requestInfo.expireDate; //

          rawData = JSON.stringify(requestBody); // console.log(rawData);

          sign = util.createRSASignature(rawData, privateKey);
          headers = {
            "Content-Type": "application/json",
            Signature: "".concat(sign)
          };
          console.log(process.env.NODE_ENV);
          console.log("VA URL", config.baokim.virtualaccount.url);
          _context2.next = 9;
          return regeneratorRuntime.awrap(axios.post(config.baokim.virtualaccount.url, requestBody, {
            headers: headers
          }));

        case 9:
          res = _context2.sent;
          return _context2.abrupt("return", res);

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var updateVirtualAccount = function updateVirtualAccount(requestInfo) {
  var requestBody, sign, headers, res;
  return regeneratorRuntime.async(function updateVirtualAccount$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          requestBody = {
            RequestId: requestInfo.requestId,
            RequestTime: requestInfo.requestTime,
            PartnerCode: PARTNERCODE,
            Operation: OPERATION_UPDATE,
            CreateType: CREATETYPE,
            AccName: requestInfo.accountName,
            OrderId: requestInfo.orderId,
            AccNo: requestInfo.accountNo
          };
          if (requestInfo.expireDate) requestBody.ExpireDate = requestInfo.expireDate;
          if (requestInfo.amountMin) requestBody.CollectAmountMin = requestInfo.amountMin;
          if (requestInfo.amountMax) requestBody.CollectAmountMax = requestInfo.amountMax;
          if (requestInfo.accountName) requestBody.AccName = requestInfo.accountName; //

          sign = util.createRSASignature(JSON.stringify(requestBody), privateKey);
          headers = {
            "Content-Type": "application/json",
            Signature: "".concat(sign)
          };
          _context3.next = 9;
          return regeneratorRuntime.awrap(axios.post(config.baokim.virtualaccount.url, requestBody, {
            headers: headers
          }));

        case 9:
          res = _context3.sent;
          return _context3.abrupt("return", res);

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var getVirtualAccount = function getVirtualAccount(accountNo) {
  var requestId, requestTime, requestInfo, response;
  return regeneratorRuntime.async(function getVirtualAccount$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          requestId = "BK".concat(moment().tz(TIMEZONE_VN).format("x")).concat(Math.random(100));
          requestTime = moment().tz(TIMEZONE_VN).format("YYYY-MM-DD HH:mm:ss");
          requestInfo = {
            requestId: requestId,
            requestTime: requestTime,
            accountNo: accountNo
          };
          _context4.next = 5;
          return regeneratorRuntime.awrap(retriveVirtualAccount(requestInfo));

        case 5:
          response = _context4.sent;

          if (!(response.data || response.data.ResponseCode == 200)) {
            _context4.next = 9;
            break;
          }

          console.log(response.data);
          return _context4.abrupt("return", response.data);

        case 9:
          return _context4.abrupt("return", null);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var retriveVirtualAccount = function retriveVirtualAccount(requestInfo) {
  var requestBody, sign, headers, res;
  return regeneratorRuntime.async(function retriveVirtualAccount$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          requestBody = {
            RequestId: requestInfo.requestId,
            RequestTime: requestInfo.requestTime,
            PartnerCode: PARTNERCODE,
            Operation: OPERATION_SEARCH,
            AccNo: requestInfo.accountNo
          };
          sign = util.createRSASignature(JSON.stringify(requestBody), privateKey);
          headers = {
            "Content-Type": "application/json",
            Signature: "".concat(sign)
          };
          _context5.next = 5;
          return regeneratorRuntime.awrap(axios.post(config.baokim.virtualaccount.url, requestBody, {
            headers: headers
          }));

        case 5:
          res = _context5.sent;
          return _context5.abrupt("return", res);

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  createVirtualAccount: createVirtualAccount,
  getVirtualAccount: getVirtualAccount,
  registerVirtualAccount: registerVirtualAccount,
  retriveVirtualAccount: retriveVirtualAccount,
  updateVirtualAccount: updateVirtualAccount
};