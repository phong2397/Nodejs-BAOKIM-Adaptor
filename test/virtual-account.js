//During the test the env variable is set to test
process.env.NODE_ENV = "production";
let baokimUtils = require("../utils/baokim/baokim-utils");
let virtualAccount = require("../services/virtual-account");
let moment = require("moment");
let { v4: uuidv4 } = require("uuid");
let fs = require("fs");
let { config } = require("../config/config");
let publicKeyBK = fs.readFileSync(
  config.baokim.virtualaccount.publickey.baokim,
);
let publickey = fs.readFileSync(config.baokim.disbursement.publickey);
let privatekey = fs.readFileSync(config.baokim.disbursement.privatekey);
let chai = require("chai");
const util = require("../utils/util");
let expect = chai.expect;

describe("Baokim", () => {
  beforeEach(done => {
    done();
  });
  describe("Product Test Script", () => {
    it("VA must be found", async () => {
      let requestInfo = {
        requestId: `BK${moment().format("x")}`,
        requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        accountName: "Tran Gia Bao",
        amountMin: "50000",
        amountMax: "1000000",
        expireDate: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        orderId: `OD${moment().format("YYYYMMDDHHMMSS")}`,
      };
      let resp = await virtualAccount.registerVirtualAccount(requestInfo);
      expect(resp.status).to.equal(200);
      expect(resp.data).to.not.equal(undefined);
      expect(resp.data.ResponseCode).to.equal(200);
      expect(resp.data.ResponseMessage).to.equal("Success");
      let accNo = resp.data.AccountInfo.BANK.AccNo;
      let requestSearch = {
        requestId: `BK${moment().format("x")}${Math.random(100)}`,
        requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        accountNo: accNo,
      };
      let respSearch = await virtualAccount.retriveVirtualAccount(
        requestSearch,
      );
      expect(respSearch.status).to.equal(200);
      expect(respSearch.data).to.not.equal(undefined);
      expect(respSearch.data.ResponseCode).to.equal(200);
      expect(respSearch.data.ResponseMessage).to.equal("Success");
    });
  });
  describe("VA Test", () => {
    it("VA must be created", async () => {
      let requestInfo = {
        requestId: `BK${moment().unix()}${Math.random(100)}`,
        requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        accountName: "Tran Gia Bao",
        amountMin: "100000",
        amountMax: "100000",
        expireDate: moment().add(7, "days").format("YYYY-MM-DD HH:mm:ss"),
        orderId: `OD${moment().format("YYYYMMDDHHMMSS")}`,
      };
      let resp = await virtualAccount.registerVirtualAccount(requestInfo);
      expect(resp.status).to.equal(200);
      expect(resp.data).to.not.equal(undefined);
      expect(resp.data.ResponseCode).to.equal(200);
      expect(resp.data.ResponseMessage).to.equal("Success");
    });
    it("VA must be found", async () => {
      let requestInfo = {
        requestId: `BK${moment().format("x")}`,
        requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        accountName: "Tran Gia Bao",
        amountMin: "100000",
        amountMax: "100000",
        expireDate: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        orderId: `OD${moment().format("YYYYMMDDHHMMSS")}`,
      };
      let resp = await virtualAccount.registerVirtualAccount(requestInfo);
      expect(resp.status).to.equal(200);
      expect(resp.data).to.not.equal(undefined);
      expect(resp.data.ResponseCode).to.equal(200);
      expect(resp.data.ResponseMessage).to.equal("Success");
      let accNo = resp.data.AccountInfo.BANK.AccNo;
      let requestSearch = {
        requestId: `BK${moment().format("x")}${Math.random(100)}`,
        requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        accountNo: accNo,
      };
      let respSearch = await virtualAccount.retriveVirtualAccount(
        requestSearch,
      );
      expect(respSearch.status).to.equal(200);
      expect(respSearch.data).to.not.equal(undefined);
      expect(respSearch.data.ResponseCode).to.equal(200);
      expect(respSearch.data.ResponseMessage).to.equal("Success");
    });
    it("VA must be updated", async () => {
      let requestInfo = {
        requestId: `BK${moment().unix()}`,
        requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        accountName: "Tran Gia Bao",
        amountMin: "100000",
        amountMax: "100000",
        expireDate: moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
        orderId: `OD${moment().format("YYYYMMDDHHMMSS")}`,
      };
      let resp = await virtualAccount.registerVirtualAccount(requestInfo);
      let requestInfoUpdate = {
        requestId: `BK${moment().unix()}${Math.random(100)}`,
        requestTime: moment().format("YYYY-MM-DD HH:mm:ss"),
        accountNo: resp.data.AccountInfo.BANK.AccNo,
        accountName: "Tran Gia Bao",
        amountMin: "150000",
        amountMax: "200000",
        orderId: requestInfo.orderId,
      };
      let respUpdate = await virtualAccount.updateVirtualAccount(
        requestInfoUpdate,
      );
      expect(respUpdate.status).to.equal(200);
      expect(respUpdate.data).to.not.equal(undefined);
      expect(respUpdate.data.ResponseCode).to.equal(200);
      expect(respUpdate.data.ResponseMessage).to.equal("Success");
    });
    it.only("Check signature", () => {
      let sign =
        "FPOJpsz5cxkcfW9W3eOlMgRSWXCuzdqm711YD84FYLF3p16C2Ghx9qLUqqpXSu0gN3VOp9aChOOaAuBa0PixksDB2fS4UXYAyqDwEkBAC4edij4A0Vsl/EtarIpX0vhQmn+V5TlfXH3fHw1B9x/O0Hk4yY3OjUt23jojKHyGkB4=";
      let dataSign = `{"RequestId":"BK31c54e1318d6255","RequestTime":"2020-10-13 16:08:34","PartnerCode":"BAOKIM","AccName":"BK VAYSV","AccNo":"00856293476","ExpireDate":"2020-10-01 13:34:26","OrderId":"OD20200930130928","BankShortName":"VPBANK"}`;
      let check = util.baokimVerifySignature(dataSign, sign, publicKeyBK);
      expect(check).to.equal(true);
    });
    it("Signature must be verified", async () => {
      let data = {
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
        Signature:
          "zT0dcQWK9TqrpMxdtc7jvQn6SNZi7P+IBdP9p/PjuXDGuSGRd9oRehbQMVK3FH0OuvEtG1BQLO/YpxW7pYu/gy2gBLFD2CIcenJ5SfCENGjc240Eq5mG7NiN/AnL+hYhUns/VN4N3VoLZ5dKdwPOlnryzq8pboNypv2T0qfDqPk=",
      };
      data.ClientIdNo = data.ClientIdNo ? data.ClientIdNo : "";
      let rawText = `${data.RequestId}|${data.RequestTime}|${data.PartnerCode}|${data.AccNo}|${data.ClientIdNo}|${data.TransId}|${data.TransAmount}|${data.TransTime}|${data.BefTransDebt}|${data.AffTransDebt}|${data.AccountType}|${data.OrderId}`;
      let check = util.baokimVerifySignature(
        rawText,
        data.Signature,
        publicKeyBK,
      );
      expect(check).to.equal(true);
    });
  });
});
