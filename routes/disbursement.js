const express = require("express");
const router = express.Router();
const disbursement = require("../services/disbursement");

router.post("/validatecustomer", async function (req, res) {
  let bankNo = req.body.bankNo;
  let accNo = req.body.accNo;
  let response = await disbursement.validateCustomer(accNo, bankNo);
  res.json(response.data);
});
router.post("/transfermoney", async function (req, res) {
  let accNo = req.body.accNo;
  let bankNo = req.body.bankNo;
  let requestAmount = req.body.requestAmount;
  let memo = req.body.memo;
  let response = await disbursement.transferMoney(
    accNo,
    bankNo,
    requestAmount,
    memo,
  );
  res.json(response.data);
});
router.post("/transaction", async function (req, res) {
  let referenceId = req.body.referenceId;
  let response = await disbursement.checkTransaction(referenceId);
  res.json(response.data);
});

module.exports = router;
