"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//LOAD CONIFG
require("dotenv").config();

var fs = require("fs");

var util = require("../util");

var appRootPath = require("app-root-path");

var moment = require("moment-timezone");

var logger = require("../winston/winston");

var _require = require("".concat(appRootPath, "/config/config")),
    config = _require.config;

var privatekey = fs.readFileSync(config.baokim.privatekey);
var PARTNERCODE = config.baokim.virtualaccount.partnercode;
var TIME_FORMAT_CLOCKTIME = "YYYY-MM-DD HH:mm:ss";
var TIME_FORMAT_FLAT = "YYYYMMDD";
var MIN_RANDOM_NUMBER = 100;
var MAX_RANDOM_NUMBER = 999;
var TRANSFERMONEY = {
  VERIFYCUSTOMER: config.baokim.disbursement.operation.verifyCustomer,
  TRANSFER: config.baokim.disbursement.operation.transferMoney,
  CHECKTRANSACTION: config.baokim.disbursement.operation.checkTransaction,
  ACCTYPE: 0
};
var VIRTUALACCOUNT = {
  CREATE: config.baokim.virtualaccount.operation.create,
  // CREATE VA
  UPDATE: config.baokim.virtualaccount.operation.update,
  // UPDATE VA
  SEARCH: config.baokim.virtualaccount.operation.search,
  // SEARCH VA
  TRANSACTION_SEARCH: config.baokim.virtualaccount.operation.transaction,
  // TRANSACTION SEARCH VA
  CREATETYPE: config.baokim.virtualaccount.settings.createtype // BAOKIM AUTO GENERTATE ACCOUNT NO

};
var TIMEZONE_VN = "Asia/Ho_Chi_Minh";

var postToServer = function postToServer(url, data, headers) {
  return regeneratorRuntime.async(function postToServer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case "end":
          return _context.stop();
      }
    }
  });
}; //


var RequestInfo =
/*#__PURE__*/
function () {
  function RequestInfo() {
    _classCallCheck(this, RequestInfo);

    this.RequestId = "BK".concat(moment().tz(TIMEZONE_VN).format(TIME_FORMAT_FLAT)).concat(randomInteger(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER));
    this.RequestTime = moment().tz(TIMEZONE_VN).format(TIME_FORMAT_CLOCKTIME);
    this.PartnerCode = PARTNERCODE;
  }

  _createClass(RequestInfo, [{
    key: "getRawDataFormatted",
    value: function getRawDataFormatted() {
      return "".concat(this.RequestId, "|").concat(this.RequestTime, "|").concat(this.PartnerCode);
    }
  }]);

  return RequestInfo;
}();

var RegisterVirtualAccount =
/*#__PURE__*/
function (_RequestInfo) {
  _inherits(RegisterVirtualAccount, _RequestInfo);

  function RegisterVirtualAccount(_ref) {
    var _this;

    var accName = _ref.accName,
        amountMin = _ref.amountMin,
        amountMax = _ref.amountMax,
        expireDate = _ref.expireDate;

    _classCallCheck(this, RegisterVirtualAccount);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RegisterVirtualAccount).call(this));
    _this.Operation = VIRTUALACCOUNT.CREATE;
    _this.CreateType = VIRTUALACCOUNT.CREATETYPE;
    _this.AccName = accName;
    _this.CollectAmountMin = amountMin;
    _this.CollectAmountMax = amountMax;
    _this.AccNo = "NULL";
    _this.OrderId = "ODVA".concat(moment().format("YYYYMMDDHHmmss"));
    _this.ExpireDate = expireDate;
    return _this;
  }

  return RegisterVirtualAccount;
}(RequestInfo);

var UpdateVirtualAccount =
/*#__PURE__*/
function (_RequestInfo2) {
  _inherits(UpdateVirtualAccount, _RequestInfo2);

  function UpdateVirtualAccount(_ref2) {
    var _this2;

    var accNo = _ref2.accNo,
        accName = _ref2.accName,
        amountMin = _ref2.amountMin,
        amountMax = _ref2.amountMax,
        expireDate = _ref2.expireDate;

    _classCallCheck(this, UpdateVirtualAccount);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(UpdateVirtualAccount).call(this));
    _this2.Operation = VIRTUALACCOUNT.UPDATE;
    _this2.AccNo = accNo;
    _this2.AccName = accName;
    _this2.CollectAmountMin = amountMin;
    _this2.CollectAmountMax = amountMax;
    _this2.OrderId = "ODVA".concat(moment().format("YYYYMMDDHHmmss"));
    _this2.ExpireDate = expireDate;
    return _this2;
  }

  return UpdateVirtualAccount;
}(RequestInfo);

var SearchVirtualAccount =
/*#__PURE__*/
function (_RequestInfo3) {
  _inherits(SearchVirtualAccount, _RequestInfo3);

  function SearchVirtualAccount(_ref3) {
    var _this3;

    var accNo = _ref3.accNo;

    _classCallCheck(this, SearchVirtualAccount);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(SearchVirtualAccount).call(this));
    _this3.Operation = VIRTUALACCOUNT.SEARCH;
    _this3.AccNo = accNo;
    return _this3;
  }

  return SearchVirtualAccount;
}(RequestInfo);

var VerifyCustomer =
/*#__PURE__*/
function (_RequestInfo4) {
  _inherits(VerifyCustomer, _RequestInfo4);

  function VerifyCustomer(_ref4) {
    var _this4;

    var accNo = _ref4.accNo,
        bankNo = _ref4.bankNo;

    _classCallCheck(this, VerifyCustomer);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(VerifyCustomer).call(this));
    _this4.Operation = TRANSFERMONEY.VERIFYCUSTOMER;
    _this4.BankNo = bankNo;
    _this4.AccNo = accNo;
    _this4.AccType = TRANSFERMONEY.ACCTYPE;
    _this4.Signature = util.createRSASignature("".concat(_this4.getRawDataFormatted(), "|").concat(_this4.Operation, "|").concat(_this4.BankNo, "|").concat(_this4.AccNo, "|").concat(_this4.AccType), privatekey);
    return _this4;
  }

  return VerifyCustomer;
}(RequestInfo);

var TransferMoney =
/*#__PURE__*/
function (_RequestInfo5) {
  _inherits(TransferMoney, _RequestInfo5);

  function TransferMoney(_ref5) {
    var _this5;

    var accNo = _ref5.accNo,
        bankNo = _ref5.bankNo,
        requestAmount = _ref5.requestAmount,
        memo = _ref5.memo;

    _classCallCheck(this, TransferMoney);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(TransferMoney).call(this));
    _this5.Operation = TRANSFERMONEY.VERIFYCUSTOMER;
    _this5.ReferenceId = _this5.RequestId + randomInteger(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
    _this5.BankNo = bankNo;
    _this5.AccNo = accNo;
    _this5.AccType = TRANSFERMONEY.ACCTYPE;
    _this5.RequestAmount = requestAmount;
    _this5.Memo = memo;
    _this5.Signature = util.createRSASignature("".concat(_this5.getRawDataFormatted(), "|").concat(_this5.Operation, "|").concat(_this5.ReferenceId, "|").concat(_this5.BankNo, "|").concat(_this5.AccNo, "|").concat(_this5.AccType, "|").concat(_this5.RequestAmount, "|").concat(_this5.Memo), privatekey);
    return _this5;
  }

  return TransferMoney;
}(RequestInfo);

var CheckTransaction =
/*#__PURE__*/
function (_RequestInfo6) {
  _inherits(CheckTransaction, _RequestInfo6);

  function CheckTransaction(_ref6) {
    var _this6;

    var referenceId = _ref6.referenceId;

    _classCallCheck(this, CheckTransaction);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(CheckTransaction).call(this));
    _this6.Operation = TRANSFERMONEY.VERIFYCUSTOMER;
    _this6.ReferenceId = referenceId;
    _this6.Signature = util.createRSASignature("".concat(_this6.getRawDataFormatted(), "|").concat(_this6.Operation, "|").concat(_this6.ReferenceId), privatekey);
    return _this6;
  }

  return CheckTransaction;
}(RequestInfo);

var requestFactory = function requestFactory() {
  _classCallCheck(this, requestFactory);

  this.createRequestInfo = function (type, operation, data) {
    var requestInfo;

    if (type === "virtualaccount") {
      if (operation === VIRTUALACCOUNT.CREATE) {
        //data = {accName, amountMin, amountMax, expireDate}
        requestInfo = new RegisterVirtualAccount(data);
      }

      if (operation === VIRTUALACCOUNT.UPDATE) {
        //data = {accNo, accName, amountMin, amountMax, expireDate}
        requestInfo = new UpdateVirtualAccount(data);
      }

      if (operation === VIRTUALACCOUNT.SEARCH) {
        //data = {accNo}
        requestInfo = new SearchVirtualAccount(data);
      }
    }

    if (type === "transfermoney") {
      if (operation === TRANSFERMONEY.VERIFYCUSTOMER) {
        //data = { bankNo, accNo }
        requestInfo = new VerifyCustomer(data);
      }

      if (operation === TRANSFERMONEY.TRANSFERMONEY) {
        //data = { accNo, bankNo, requestAmount, memo }
        requestInfo = new TransferMoney(data);
      }

      if (operation === TRANSFERMONEY.CHECKTRANSACTION) {
        //data = { referenceId }
        requestInfo = new CheckTransaction(data);
      }
    }

    return requestInfo;
  };
};

var randomInteger = function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = {
  requestFactory: requestFactory
};