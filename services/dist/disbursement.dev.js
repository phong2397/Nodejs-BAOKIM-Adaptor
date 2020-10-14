"use strict";

var appRootPath = require("app-root-path");

var axios = require("axios");

var _require = require("../utils/baokim/baokim-utils"),
    requestFactory = _require.requestFactory;

var _require2 = require("".concat(appRootPath, "/config/config")),
    config = _require2.config;

var TRANSFERMONEY = {
  VERIFYCUSTOMER: config.baokim.disbursement.operation.verifyCustomer,
  TRANSFER: config.baokim.disbursement.operation.transferMoney,
  CHECKTRANSACTION: config.baokim.disbursement.operation.checkTransaction,
  ACCTYPE: 0
};
var TRANSFERMONEY_URL = config.baokim.transferMoneyUrl;

var validateCustomer = function validateCustomer(accNo, bankNo) {
  var requestInfo, headers, res;
  return regeneratorRuntime.async(function validateCustomer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requestInfo = new requestFactory().createRequestInfo("transfermoney", TRANSFERMONEY.VERIFYCUSTOMER, {
            accNo: accNo,
            bankNo: bankNo
          });
          headers = {
            "Content-Type": "application/json"
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.post(TRANSFERMONEY_URL, requestInfo, {
            headers: headers
          }));

        case 4:
          res = _context.sent;
          return _context.abrupt("return", res);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

var transferMoney = function transferMoney(accNo, bankNo, requestAmount, memo) {
  var requestInfo, headers, res;
  return regeneratorRuntime.async(function transferMoney$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          requestInfo = new requestFactory().createRequestInfo("transfermoney", TRANSFERMONEY.TRANSFER, {
            accNo: accNo,
            bankNo: bankNo,
            requestAmount: requestAmount,
            memo: memo
          });
          headers = {
            "Content-Type": "application/json"
          };
          _context2.next = 4;
          return regeneratorRuntime.awrap(axios.post(TRANSFERMONEY_URL, requestInfo, {
            headers: headers
          }));

        case 4:
          res = _context2.sent;
          return _context2.abrupt("return", res);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var checkTransaction = function checkTransaction(referenceId) {
  var requestInfo, headers, res;
  return regeneratorRuntime.async(function checkTransaction$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          requestInfo = new requestFactory().createRequestInfo("transfermoney", TRANSFERMONEY.CHECKTRANSACTION, {
            referenceId: referenceId
          });
          headers = {
            "Content-Type": "application/json"
          };
          _context3.next = 4;
          return regeneratorRuntime.awrap(axios.post(TRANSFERMONEY_URL, requestInfo, {
            headers: headers
          }));

        case 4:
          res = _context3.sent;
          return _context3.abrupt("return", res);

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports = {
  validateCustomer: validateCustomer,
  transferMoney: transferMoney,
  checkTransaction: checkTransaction
};