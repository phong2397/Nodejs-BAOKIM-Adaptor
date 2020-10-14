//During the test the env variable is set to test
process.env.NODE_ENV = "production";
let baokimUtils = require("../utils/baokim/baokim-utils");
let virtualAccount = require("../services/virtual-account");
let moment = require("moment");
let { v4: uuidv4 } = require("uuid");
let fs = require("fs");
let { config } = require("../config/config");
let publicKeyBK = fs.readFileSync(config.baokim.publickeyBaokim);
let publickey = fs.readFileSync(config.baokim.publickey);
let privatekey = fs.readFileSync(config.baokim.privatekey);
let chai = require("chai");
const util = require("../utils/util");
let expect = chai.expect;

describe("Baokim", () => {
  beforeEach(done => {
    done();
  });
  describe("Product Test Script", () => {
    it("VA must be found", async () => {
      let resp = await virtualAccount.createVirtualAccount(
        "Tran Gia Bao",
        "50000",
        "1000000",
        moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
      );
      expect(resp.status).to.equal(200);
      expect(resp.data).to.not.equal(undefined);
      expect(resp.data.ResponseCode).to.equal(200);
      expect(resp.data.ResponseMessage).to.equal("Success");
      let accNo = resp.data.AccountInfo.BANK.AccNo;
      let respSearch = await virtualAccount.retriveVirtualAccount(accNo);
      expect(respSearch.status).to.equal(200);
      expect(respSearch.data).to.not.equal(undefined);
      expect(respSearch.data.ResponseCode).to.equal(200);
      expect(respSearch.data.ResponseMessage).to.equal("Success");
    });
  });
  describe("VA Test", () => {
    it("VA must be created", async () => {
      let resp = await virtualAccount.createVirtualAccount(
        "Tran Gia Bao",
        "50000",
        "1000000",
        moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
      );
      expect(resp.status).to.equal(200);
      expect(resp.data).to.not.equal(undefined);
      expect(resp.data.ResponseCode).to.equal(200);
      expect(resp.data.ResponseMessage).to.equal("Success");
    });
    it("VA must be found", async () => {
      let resp = await virtualAccount.createVirtualAccount(
        "Tran Gia Bao",
        "50000",
        "1000000",
        moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
      );
      expect(resp.status).to.equal(200);
      expect(resp.data).to.not.equal(undefined);
      expect(resp.data.ResponseCode).to.equal(200);
      expect(resp.data.ResponseMessage).to.equal("Success");
      let accNo = resp.data.AccountInfo.BANK.AccNo;
      let respSearch = await virtualAccount.retriveVirtualAccount(accNo);
      expect(respSearch.status).to.equal(200);
      expect(respSearch.data).to.not.equal(undefined);
      expect(respSearch.data.ResponseCode).to.equal(200);
      expect(respSearch.data.ResponseMessage).to.equal("Success");
    });
    it("VA must be updated", async () => {
      let resp = await virtualAccount.createVirtualAccount(
        "Tran Gia Bao",
        "50000",
        "1000000",
        moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
      );
      expect(resp.status).to.equal(200);
      expect(resp.data).to.not.equal(undefined);
      expect(resp.data.ResponseCode).to.equal(200);
      expect(resp.data.ResponseMessage).to.equal("Success");
      let accNo = resp.data.AccountInfo.BANK.AccNo;
      let respUpdate = await virtualAccount.updateVirtualAccount(
        accNo,
        "Tran Bao Gia",
        "100000",
        "1000000",
        moment().add(1, "days").format("YYYY-MM-DD HH:mm:ss"),
      );
      expect(respUpdate.status).to.equal(200);
      expect(respUpdate.data).to.not.equal(undefined);
      expect(respUpdate.data.ResponseCode).to.equal(200);
      expect(respUpdate.data.ResponseMessage).to.equal("Success");
    });
  });
});
