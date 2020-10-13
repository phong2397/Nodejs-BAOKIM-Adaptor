"use strict";

var _require = require("uuid"),
    uuidv4 = _require.v4;

var moment = require("moment-timezone");

var express = require("express");

var router = express.Router();

var util = require("../utils/util");

var _require2 = require("../config/config"),
    config = _require2.config;

var fs = require("fs");

var appRootPath = require("app-root-path");

var privateKey = config.baokim.virtualaccount.privatekey;
var publickey = config.baokim.virtualaccount.publickey.sfg;
var baoKimPublicKey = config.baokim.virtualaccount.publickey.baokim;

var virtualAccount = require("../services/virtual-account"); //TOTO: Unit Test


router.get("/", function _callee(req, res, next) {
  var _req$query, _req$query$page, page, _req$query$limit, limit;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$query = req.query, _req$query$page = _req$query.page, page = _req$query$page === void 0 ? 1 : _req$query$page, _req$query$limit = _req$query.limit, limit = _req$query$limit === void 0 ? 10 : _req$query$limit;
          return _context.abrupt("return", res.status(200).json({
            msg: "WORKING..."
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}); //TODO: Unit Test

router.get("/:accountNo", function _callee2(req, res, next) {
  var accountNo, account;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          accountNo = req.params.accountNo;

          if (accountNo) {
            _context2.next = 3;
            break;
          }

          return _context2.abrupt("return", res.json({
            msg: "accountNo not empty"
          }));

        case 3:
          _context2.next = 5;
          return regeneratorRuntime.awrap(virtualAccount.getVirtualAccount(accountNo));

        case 5:
          account = _context2.sent;

          if (!account) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(200).json(account));

        case 10:
          return _context2.abrupt("return", res.status(404).json({
            msg: "Not found"
          }));

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //TOTO: Unit Test & Catch error when data response with error code

router.post("/", function _callee3(req, res, next) {
  var accountName, amountMin, amountMax, expireDate, newAccount;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          accountName = req.body.accountName;
          amountMin = req.body.amountMin;
          amountMax = req.body.amountMax;
          expireDate = moment().add(3, "days").format("YYYY-MM-DD HH:mm:ss");
          _context3.next = 6;
          return regeneratorRuntime.awrap(virtualAccount.createVirtualAccount(accountName, amountMin, amountMax, expireDate));

        case 6:
          newAccount = _context3.sent;

          if (!newAccount) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(200).json(newAccount));

        case 9:
          return _context3.abrupt("return", res.json({
            code: 204,
            msg: "Cannot create"
          }));

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
}); //Need test

router.put("/", function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", res.json({
            code: 204,
            msg: "Cannot update"
          }));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
});
module.exports = router;