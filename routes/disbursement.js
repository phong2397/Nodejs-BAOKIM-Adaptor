const express = require("express");
const router = express.Router();
const disbursement = require("../services/disbursement");
const appRootPath = require("app-root-path");
const { config } = require(`${appRootPath}/config/config`);
const url = config.baokim.disbursement.urlapptest;

router.post("/checkuserinfo", async function (req, res) {
  data = disbursement.setCheckUserInfoData(req.body);
  paymentgatewayResp = await disbursement.sendToPaymentgateway(url, data);
  res.json(paymentgatewayResp);
});

router.post("/transfer", async function (req, res) {
  data = disbursement.setTransfer(req.body);
  paymentgatewayResp = await disbursement.sendToPaymentgateway(url, data);
  res.json(paymentgatewayResp);
});

router.post("/checktransactionstatus", async function (req, res) {
  data = disbursement.setCheckTransStatus(req.body);
  paymentgatewayResp = await disbursement.sendToPaymentgateway(url, data);
  res.json(paymentgatewayResp);
});

module.exports = router;
