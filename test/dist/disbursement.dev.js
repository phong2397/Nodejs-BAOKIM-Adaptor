"use strict";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; //During the test the env variable is set to test
// process.env.NODE_ENV = "test";

var chai = require("chai");

var chaiHttp = require("chai-http");

var server = require("../app");

var should = chai.should();

var assert = require("chai").assert;

var fs = require("fs");

var yaml = require("js-yaml");

chai.use(chaiHttp);
describe("BAOKIM Disbursement", function () {
  beforeEach(function (done) {
    done();
  });
  context("Check User Infomation", function () {
    it("it should return user info success", function (done) {
      chai.request(server).post("/disbursement/validatecustomer").set("Content-Type", "application/json").send({
        bankNo: "970457",
        accNo: "100100132448"
      }).end(function (err, res) {
        res.should.have.status(200);
        assert.equal(res.body.ResponseCode, 200, "ResponseCode success must is 200");
        done();
      });
    });
  });
  context("Transfer money", function () {
    it("it should transfer success", function (done) {
      chai.request(server).post("/disbursement/transfermoney").set("Content-Type", "application/json").send({
        accNo: "100100132448",
        bankNo: "970457",
        requestAmount: "50000",
        memo: "Test chuyen tien"
      }).end(function (err, res) {
        res.should.have.status(200);
        assert.equal(res.body.ResponseCode, 200, "ResponseCode success must is 200");
        refId = res.body.ReferenceId;
        done();
      });
    });
  });
  context("Check transaction status", function () {
    it("it should return transaction info success", function (done) {
      chai.request(server).post("/disbursement/transfermoney").set("Content-Type", "application/json").send({
        accNo: "100100132448",
        bankNo: "970457",
        requestAmount: "50000",
        memo: "Test chuyen tien"
      }).end(function (err, res) {
        res.should.have.status(200);
        assert.equal(res.body.ResponseCode, 200, "ResponseCode success must is 200");
        var refId = res.body.ReferenceId;
        chai.request(server).post("/disbursement/transaction").set("Content-Type", "application/json").send({
          referenceId: refId
        }).end(function (err, res) {
          res.should.have.status(200);
          assert.equal(res.body.ResponseCode, 200, "ResponseCode success must is 200");
          done();
        });
      });
    });
  });
});