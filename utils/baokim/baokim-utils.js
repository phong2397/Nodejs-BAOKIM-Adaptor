//LOAD CONIFG
require("dotenv").config();
const fs = require("fs");
const util = require("../util");
const appRootPath = require("app-root-path");
const moment = require("moment-timezone");
const axios = require("axios");
const logger = require("../winston/winston");

const { config } = require(`${appRootPath}/config/config`);
const privatekey = fs.readFileSync(config.baokim.privatekey);
const PARTNERCODE = config.baokim.partnercode;
const TIME_FORMAT_CLOCKTIME = "YYYY-MM-DD HH:mm:ss";
const TIME_FORMAT_CLOCKTIME_FLAT = "YYYYMMDDHHmmss";
const TIME_FORMAT_FLAT = "YYYYMMDD";
const TIMEZONE_VN = "Asia/Ho_Chi_Minh";
const MIN_RANDOM_NUMBER = 100;
const MAX_RANDOM_NUMBER = 999;
const { TRANSFERMONEY, VIRTUALACCOUNT } = require("../enum/enum");
const { extend } = require("date-and-time");

//TODO: Catch request and process
var postToServer = async (url, data, headers) => {
  logger.loggerConsole("SEND").info(url);
  let res = await axios.post(url, data, {
    headers,
  });
  return res;
};
//
class RequestInfo {
  constructor() {
    this.RequestId = `BK${moment()
      .tz(TIMEZONE_VN)
      .format(TIME_FORMAT_FLAT)}${randomInteger(
      MIN_RANDOM_NUMBER,
      MAX_RANDOM_NUMBER,
    )}`;
    this.RequestTime = moment().tz(TIMEZONE_VN).format(TIME_FORMAT_CLOCKTIME);
    this.PartnerCode = PARTNERCODE;
  }
  getRawDataFormatted() {
    return `${this.RequestId}|${this.RequestTime}|${this.PartnerCode}`;
  }
}
class RegisterVirtualAccount extends RequestInfo {
  constructor({ accName, amountMin, amountMax, expireDate }) {
    super();
    this.Operation = VIRTUALACCOUNT.CREATE;
    this.CreateType = VIRTUALACCOUNT.CREATETYPE;
    this.AccName = accName;
    this.CollectAmountMin = amountMin;
    this.CollectAmountMax = amountMax;
    this.AccNo = "NULL";
    this.OrderId = `ODVA${moment().format(TIME_FORMAT_CLOCKTIME_FLAT)}`;
    this.ExpireDate = expireDate;
  }
}
class UpdateVirtualAccount extends RequestInfo {
  constructor({ accNo, accName, amountMin, amountMax, expireDate }) {
    super();
    this.Operation = VIRTUALACCOUNT.UPDATE;
    this.AccNo = accNo;
    this.AccName = accName;
    this.CollectAmountMin = amountMin;
    this.CollectAmountMax = amountMax;
    this.OrderId = `ODVA${moment().format(TIME_FORMAT_CLOCKTIME_FLAT)}`;
    this.ExpireDate = expireDate;
  }
}
class SearchVirtualAccount extends RequestInfo {
  constructor({ accNo }) {
    super();
    this.Operation = VIRTUALACCOUNT.SEARCH;
    this.AccNo = accNo;
  }
}
class CheckTransactionVirtualAccount extends RequestInfo {
  constructor({ referenceId }) {
    super();
    this.Operation = VIRTUALACCOUNT.TRANSACTION_SEARCH;
    this.referenceId = referenceId;
  }
}
class VerifyCustomer extends RequestInfo {
  constructor({ accNo, bankNo }) {
    super();
    this.Operation = TRANSFERMONEY.VERIFYCUSTOMER;
    this.BankNo = bankNo;
    this.AccNo = accNo;
    this.AccType = TRANSFERMONEY.ACCTYPE;
    this.Signature = util.createRSASignature(
      this.getRawDataFormatted(),
      privatekey,
    );
  }
  getRawDataFormatted() {
    return (
      super.getRawDataFormatted() +
      `|${this.Operation}|${this.BankNo}|${this.AccNo}|${this.AccType}`
    );
  }
}
class TransferMoney extends RequestInfo {
  constructor({ accNo, bankNo, requestAmount, memo }) {
    super();
    this.Operation = TRANSFERMONEY.TRANSFER;
    this.ReferenceId =
      this.RequestId + randomInteger(MIN_RANDOM_NUMBER, MAX_RANDOM_NUMBER);
    this.BankNo = bankNo;
    this.AccNo = accNo;
    this.AccType = TRANSFERMONEY.ACCTYPE;
    this.RequestAmount = requestAmount;
    this.Memo = memo;
    // RequestId|RequestTime|PartnerCode|Operation|ReferenceId|BankNo|AccNo|AccType|RequestAmount|Memo
    this.Signature = util.createRSASignature(
      this.getRawDataFormatted(),
      privatekey,
    );
  }
  getRawDataFormatted() {
    return (
      super.getRawDataFormatted() +
      `|${this.Operation}|${this.ReferenceId}|${this.BankNo}|${this.AccNo}|${this.AccType}|${this.RequestAmount}|${this.Memo}`
    );
  }
}
class CheckTransaction extends RequestInfo {
  constructor({ referenceId }) {
    super();
    this.Operation = TRANSFERMONEY.CHECKTRANSACTION;
    this.ReferenceId = referenceId;
    this.Signature = util.createRSASignature(
      this.getRawDataFormatted(),
      privatekey,
    );
  }
  getRawDataFormatted() {
    return (
      super.getRawDataFormatted() + `|${this.Operation}|${this.ReferenceId}`
    );
  }
}
class requestFactory {
  constructor() {
    this.createRequestInfo = function (type, operation, data) {
      var requestInfo;
      if (type === "virtualaccount") {
        if (operation === VIRTUALACCOUNT.CREATE) {
          // data = { accName, amountMin, amountMax, expireDate };
          requestInfo = new RegisterVirtualAccount(data);
        }
        if (operation === VIRTUALACCOUNT.UPDATE) {
          // data = { accNo, accName, amountMin, amountMax, expireDate };
          requestInfo = new UpdateVirtualAccount(data);
        }
        if (operation === VIRTUALACCOUNT.SEARCH) {
          // data = { accNo };
          requestInfo = new SearchVirtualAccount(data);
        }
        if (operation === VIRTUALACCOUNT.TRANSACTION_SEARCH) {
          // data = { referenceId };
          requestInfo = new CheckTransactionVirtualAccount(data);
        }
      }
      if (type === "transfermoney") {
        if (operation === TRANSFERMONEY.VERIFYCUSTOMER) {
          //data = { bankNo, accNo }
          requestInfo = new VerifyCustomer(data);
        }
        if (operation === TRANSFERMONEY.TRANSFER) {
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
  }
}
var randomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
module.exports = { requestFactory: requestFactory };
