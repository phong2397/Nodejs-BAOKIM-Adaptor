const { v4: uuidv4 } = require("uuid");
const moment = require("moment-timezone");
const express = require("express");
const router = express.Router();
const virtualAccount = require("../services/virtual-account");
const EXPIRE_DAY = 10000;
//TODO: Unit Test
router.get("/", async function (req, res, next) {
  const { page = 1, limit = 10 } = req.query;
  return res.status(200).json({ msg: "WORKING..." });
});
//TODO: Unit Test
router.get("/:accNo", async function (req, res, next) {
  let accNo = req.params.accNo;
  if (!accountNo) {
    return res.json({ msg: "accountNo not empty" });
  }
  let response = await virtualAccount.getVirtualAccount(accNo);
  if (response) {
    return res.status(200).json(response.data);
  } else {
    return res.status(404).json({ msg: "Not found" });
  }
});
//TODO: Unit Test & Catch error when data response with error code
router.post("/", async function (req, res, next) {
  let accName = req.body.accName;
  let amountMin = req.body.amountMin;
  let amountMax = req.body.amountMax;
  let expireDate = moment()
    .add(EXPIRE_DAY, "days")
    .format("YYYY-MM-DD HH:mm:ss");
  let response = await virtualAccount.createVirtualAccount(
    accName,
    amountMin,
    amountMax,
    expireDate,
  );
  if (response.status == 200) {
    return res.status(200).json(response.data);
  }
  return res.json({ code: 204, msg: "Cannot create" });
});
router.put("/:accountNo", async function (req, res, next) {
  let accNo = req.params.accNo;
  let accName = req.body.accName;
  let amountMin = req.body.amountMin;
  let amountMax = req.body.amountMax;
  let lifeTime = req.body.lifeTime;
  let expireDate = moment().add(lifeTime, "days").format("YYYY-MM-DD HH:mm:ss");
  let response = await virtualAccount.updateVirtualAccount(
    accNo,
    accName,
    amountMin,
    amountMax,
    expireDate,
  );
  if (response.status(200)) {
    return res.status(200).json(response.data);
  }
  return res.json({ code: 204, msg: "Cannot create" });
});
//Need test
router.get("/transaction/:referenceId", async function (req, res, next) {
  let referenceId = req.params.referenceId;
  let response = await virtualAccount.searchTransaction(referenceId);
  if (response.status == 200) {
    return res.status(200).json(response.data);
  }
  return res.json({ code: 404, msg: "Not found" });
});

module.exports = router;
