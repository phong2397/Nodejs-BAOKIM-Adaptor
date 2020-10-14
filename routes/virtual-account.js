const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");
const express = require("express");
const router = express.Router();
const util = require("../utils/util");
const { config } = require("../config/config");
const fs = require("fs");
const appRootPath = require("app-root-path");
const privateKey = config.baokim.virtualaccount.privatekey;
const publickey = config.baokim.virtualaccount.publickey.sfg;
const baoKimPublicKey = config.baokim.virtualaccount.publickey.baokim;
const virtualAccount = require("../services/virtual-account");

//TOTO: Unit Test
router.get("/", async function (req, res, next) {
  const { page = 1, limit = 10 } = req.query;
  return res.status(200).json({ msg: "WORKING..." });
});
//TODO: Unit Test
router.get("/:accountNo", async function (req, res, next) {
  let accountNo = req.params.accountNo;
  if (!accountNo) {
    return res.json({ msg: "accountNo not empty" });
  }
  let account = await virtualAccount.getVirtualAccount(accountNo);
  if (account) {
    return res.status(200).json(account);
  } else {
    return res.status(404).json({ msg: "Not found" });
  }
});
//TOTO: Unit Test & Catch error when data response with error code
router.post("/", async function (req, res, next) {
  let accountName = req.body.accountName;
  let amountMin = req.body.amountMin;
  let amountMax = req.body.amountMax;
  let expireDate = moment().add(3, "days").format("YYYY-MM-DD HH:mm:ss");
  let newAccount = await virtualAccount.createVirtualAccount(
    accountName,
    amountMin,
    amountMax,
    expireDate,
  );
  if (newAccount) {
    return res.status(200).json(newAccount);
  }
  return res.json({ code: 204, msg: "Cannot create" });
});
//Need test
router.put("/", async function (req, res, next) {
  return res.json({ code: 204, msg: "Cannot update" });
});
module.exports = router;
