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
const { expect } = require("chai");
describe("Baokim", () => {
  beforeEach(done => {
    done();
  });
  describe.only("Product Test Script", () => {
    it("Signature must be true", async () => {
      let rawData =
        "BK20201016125|2020-10-16 12:14:01|SGFT3|9002|BK20201016125885|970407|19035023957034|0|100000|Test chuyen tien 100.000 VND";
      console.log(config.baokim.publickey);
      let signmustbe = util.createRSASignature(rawData, privatekey);
      console.log(signmustbe);
      let check = util.baokimVerifySignature(
        rawData,
        "Y23VvfVc9yZJescuJjAdRZKQ574XvbXzwgIGj4muYvDkDZ5RqugYWiEyl3hJhhYPKSP+HLnaZLwFFMbQ8+Z/dTd1NK76+uDU+MPuukjKUaECCFCWzf8rd9wvwBAIn5s78snCvED8p2cBTEfxawKihuOgq+6Xpg0/OVLqrRjliik=",
        publickey,
      );
      expect(check).to.equal(true);
    });
  });
});
