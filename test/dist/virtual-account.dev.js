"use strict";

//During the test the env variable is set to test
process.env.NODE_ENV = "production";

var baokimUtils = require("../utils/baokim/baokim-utils");

var virtualAccount = require("../services/virtual-account");

var moment = require("moment");

var _require = require("uuid"),
    uuidv4 = _require.v4;

var fs = require("fs");

var _require2 = require("../config/config"),
    config = _require2.config;

var publicKeyBK = fs.readFileSync(config.baokim.virtualaccount.publickey.baokim);
var publickey = fs.readFileSync(config.baokim.disbursement.publickey);
var privatekey = fs.readFileSync(config.baokim.disbursement.privatekey);

var chai = require("chai");

var util = require("../utils/util");

var expect = chai.expect;
describe("Baokim", function () {
  beforeEach(function (done) {
    done();
  });
  describe("Product Test Script", function () {
    it("VA must be found", function _callee() {
      var requestInfo, resp, accNo, requestSearch, respSearch;
      return regeneratorRuntime.async(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              requestInfo = {
                requestId: "BK".concat(moment().format("x")),
                requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                accountName: "Tran Gia Bao",
                amountMin: "50000",
                amountMax: "1000000",
                expireDate: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
                orderId: "OD".concat(moment().format("YYYYMMDDHHMMSS"))
              };
              _context.next = 3;
              return regeneratorRuntime.awrap(virtualAccount.registerVirtualAccount(requestInfo));

            case 3:
              resp = _context.sent;
              expect(resp.status).to.equal(200);
              expect(resp.data).to.not.equal(undefined);
              expect(resp.data.ResponseCode).to.equal(200);
              expect(resp.data.ResponseMessage).to.equal("Success");
              accNo = resp.data.AccountInfo.BANK.AccNo;
              requestSearch = {
                requestId: "BK".concat(moment().format("x")).concat(Math.random(100)),
                requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                accountNo: accNo
              };
              _context.next = 12;
              return regeneratorRuntime.awrap(virtualAccount.retriveVirtualAccount(requestSearch));

            case 12:
              respSearch = _context.sent;
              expect(respSearch.status).to.equal(200);
              expect(respSearch.data).to.not.equal(undefined);
              expect(respSearch.data.ResponseCode).to.equal(200);
              expect(respSearch.data.ResponseMessage).to.equal("Success");

            case 17:
            case "end":
              return _context.stop();
          }
        }
      });
    });
  });
  describe("VA Test", function () {
    it("VA must be created", function _callee2() {
      var requestInfo, resp;
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              requestInfo = {
                requestId: "BK".concat(moment().unix()).concat(Math.random(100)),
                requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                accountName: "Tran Gia Bao",
                amountMin: "100000",
                amountMax: "100000",
                expireDate: moment().add(7, "days").format("YYYY-MM-DD HH:mm:ss"),
                orderId: "OD".concat(moment().format("YYYYMMDDHHMMSS"))
              };
              _context2.next = 3;
              return regeneratorRuntime.awrap(virtualAccount.registerVirtualAccount(requestInfo));

            case 3:
              resp = _context2.sent;
              expect(resp.status).to.equal(200);
              expect(resp.data).to.not.equal(undefined);
              expect(resp.data.ResponseCode).to.equal(200);
              expect(resp.data.ResponseMessage).to.equal("Success");

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    it("VA must be found", function _callee3() {
      var requestInfo, resp, accNo, requestSearch, respSearch;
      return regeneratorRuntime.async(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              requestInfo = {
                requestId: "BK".concat(moment().format("x")),
                requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                accountName: "Tran Gia Bao",
                amountMin: "100000",
                amountMax: "100000",
                expireDate: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
                orderId: "OD".concat(moment().format("YYYYMMDDHHMMSS"))
              };
              _context3.next = 3;
              return regeneratorRuntime.awrap(virtualAccount.registerVirtualAccount(requestInfo));

            case 3:
              resp = _context3.sent;
              expect(resp.status).to.equal(200);
              expect(resp.data).to.not.equal(undefined);
              expect(resp.data.ResponseCode).to.equal(200);
              expect(resp.data.ResponseMessage).to.equal("Success");
              accNo = resp.data.AccountInfo.BANK.AccNo;
              requestSearch = {
                requestId: "BK".concat(moment().format("x")).concat(Math.random(100)),
                requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                accountNo: accNo
              };
              _context3.next = 12;
              return regeneratorRuntime.awrap(virtualAccount.retriveVirtualAccount(requestSearch));

            case 12:
              respSearch = _context3.sent;
              expect(respSearch.status).to.equal(200);
              expect(respSearch.data).to.not.equal(undefined);
              expect(respSearch.data.ResponseCode).to.equal(200);
              expect(respSearch.data.ResponseMessage).to.equal("Success");

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      });
    });
    it("VA must be updated", function _callee4() {
      var requestInfo, resp, requestInfoUpdate, respUpdate;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              requestInfo = {
                requestId: "BK".concat(moment().unix()),
                requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                accountName: "Tran Gia Bao",
                amountMin: "100000",
                amountMax: "100000",
                expireDate: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
                orderId: "OD".concat(moment().format("YYYYMMDDHHMMSS"))
              };
              _context4.next = 3;
              return regeneratorRuntime.awrap(virtualAccount.registerVirtualAccount(requestInfo));

            case 3:
              resp = _context4.sent;
              requestInfoUpdate = {
                requestId: "BK".concat(moment().unix()).concat(Math.random(100)),
                requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
                accountNo: resp.data.AccountInfo.BANK.AccNo,
                accountName: "Tran Gia Bao",
                amountMin: "150000",
                amountMax: "200000",
                orderId: requestInfo.orderId
              };
              _context4.next = 7;
              return regeneratorRuntime.awrap(virtualAccount.updateVirtualAccount(requestInfoUpdate));

            case 7:
              respUpdate = _context4.sent;
              expect(respUpdate.status).to.equal(200);
              expect(respUpdate.data).to.not.equal(undefined);
              expect(respUpdate.data.ResponseCode).to.equal(200);
              expect(respUpdate.data.ResponseMessage).to.equal("Success");

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    it.only("Check signature", function () {
      var sign = "FPOJpsz5cxkcfW9W3eOlMgRSWXCuzdqm711YD84FYLF3p16C2Ghx9qLUqqpXSu0gN3VOp9aChOOaAuBa0PixksDB2fS4UXYAyqDwEkBAC4edij4A0Vsl/EtarIpX0vhQmn+V5TlfXH3fHw1B9x/O0Hk4yY3OjUt23jojKHyGkB4=";
      var dataSign = "{\"RequestId\":\"BK31c54e1318d6255\",\"RequestTime\":\"2020-10-13 16:08:34\",\"PartnerCode\":\"BAOKIM\",\"AccName\":\"BK VAYSV\",\"AccNo\":\"00856293476\",\"ExpireDate\":\"2020-10-01 13:34:26\",\"OrderId\":\"OD20200930130928\",\"BankShortName\":\"VPBANK\"}";
      var check = util.baokimVerifySignature(dataSign, sign, publicKeyBK);
      expect(check).to.equal(true);
    });
    it("Signature must be verified", function _callee5() {
      var data, rawText, check;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              data = {
                RequestId: "BKc8718339ab814ed",
                RequestTime: "2020-10-02 11:56:41",
                PartnerCode: "BAOKIM",
                AccNo: "900300028108",
                ClientIdNo: null,
                TransId: "5f76b282a2dc7",
                TransAmount: 500000,
                TransTime: "2020-10-02 11:54:26",
                BefTransDebt: 10000000,
                AffTransDebt: 9500000,
                AccountType: 2,
                OrderId: "OD20201002111034",
                Signature: "zT0dcQWK9TqrpMxdtc7jvQn6SNZi7P+IBdP9p/PjuXDGuSGRd9oRehbQMVK3FH0OuvEtG1BQLO/YpxW7pYu/gy2gBLFD2CIcenJ5SfCENGjc240Eq5mG7NiN/AnL+hYhUns/VN4N3VoLZ5dKdwPOlnryzq8pboNypv2T0qfDqPk="
              };
              data.ClientIdNo = data.ClientIdNo ? data.ClientIdNo : "";
              rawText = "".concat(data.RequestId, "|").concat(data.RequestTime, "|").concat(data.PartnerCode, "|").concat(data.AccNo, "|").concat(data.ClientIdNo, "|").concat(data.TransId, "|").concat(data.TransAmount, "|").concat(data.TransTime, "|").concat(data.BefTransDebt, "|").concat(data.AffTransDebt, "|").concat(data.AccountType, "|").concat(data.OrderId);
              check = util.baokimVerifySignature(rawText, data.Signature, publicKeyBK);
              expect(check).to.equal(true);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
  });
});