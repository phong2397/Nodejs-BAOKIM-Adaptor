process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
process.env.NODE_ENV = "test";
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
let assert = require("chai").assert;
let fs = require("fs");
let yaml = require("js-yaml");

var disbursementData = yaml.safeLoad(
  fs.readFileSync("./test/data/disbursement-sample.yaml", "utf8")
);
var refId = "";

chai.use(chaiHttp);
describe("BAOKIM Disbursement", () => {
  beforeEach((done) => {
    done();
  });
  context("Check User Infomation", () => {
    it("it should return user info success", (done) => {
      chai
        .request(server)
        .post("/disbursement/checkuserinfo")
        .set("Content-Type", "application/json")
        .send(disbursementData.checkUserInfo)
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(
            res.body.ResponseCode,
            200,
            "ResponseCode success must is 200"
          );
          done();
        });
    });
  });
  context("Transfer money", () => {
    it("it should transfer success", (done) => {
      chai
        .request(server)
        .post("/disbursement/transfer")
        .set("Content-Type", "application/json")
        .send(disbursementData.transfer)
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(
            res.body.ResponseCode,
            200,
            "ResponseCode success must is 200"
          );
          refId = res.body.ReferenceId;
          done();
        });
    });
  });
  context("Check transaction status", () => {
    it("it should return transaction info success", (done) => {
      disbursementData.checkTransStatus.ReferenceId = refId;
      chai
        .request(server)
        .post("/disbursement/checktransactionstatus")
        .set("Content-Type", "application/json")
        .send(disbursementData.checkTransStatus)
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(
            res.body.ResponseCode,
            200,
            "ResponseCode success must is 200"
          );
          done();
        });
    });
  });
});
