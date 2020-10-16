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
describe("Baokim", () => {
  beforeEach(done => {
    done();
  });
  describe("Product Test Script", () => {
    it("Signature must be true", async () => {
      l;
    });
  });
});
