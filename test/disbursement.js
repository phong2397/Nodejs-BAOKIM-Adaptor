process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//During the test the env variable is set to test
// process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
let assert = require("chai").assert;
let fs = require("fs");
let yaml = require("js-yaml");
chai.use(chaiHttp);
describe("BAOKIM Disbursement", () => {
  beforeEach(done => {
    done();
  });
  context("Check User Infomation", () => {
    it("it should return user info success", done => {
      chai
        .request(server)
        .post("/disbursement/validatecustomer")
        .set("Content-Type", "application/json")
        .send({ bankNo: "970457", accNo: "100100132448" })
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(
            res.body.ResponseCode,
            200,
            "ResponseCode success must is 200",
          );
          done();
        });
    });
  });
  context("Transfer money", () => {
    it("it should transfer success", done => {
      chai
        .request(server)
        .post("/disbursement/transfermoney")
        .set("Content-Type", "application/json")
        .send({
          accNo: "100100132448",
          bankNo: "970457",
          requestAmount: "50000",
          memo: "Test chuyen tien",
        })
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(
            res.body.ResponseCode,
            200,
            "ResponseCode success must is 200",
          );
          refId = res.body.ReferenceId;
          done();
        });
    });
  });
  context("Check transaction status", () => {
    it("it should return transaction info success", done => {
      chai
        .request(server)
        .post("/disbursement/transfermoney")
        .set("Content-Type", "application/json")
        .send({
          accNo: "100100132448",
          bankNo: "970457",
          requestAmount: "50000",
          memo: "Test chuyen tien",
        })
        .end((err, res) => {
          res.should.have.status(200);
          assert.equal(
            res.body.ResponseCode,
            200,
            "ResponseCode success must is 200",
          );
          let refId = res.body.ReferenceId;
          chai
            .request(server)
            .post("/disbursement/transaction")
            .set("Content-Type", "application/json")
            .send({ referenceId: refId })
            .end((err, res) => {
              res.should.have.status(200);
              assert.equal(
                res.body.ResponseCode,
                200,
                "ResponseCode success must is 200",
              );
              done();
            });
        });
    });
  });
});
