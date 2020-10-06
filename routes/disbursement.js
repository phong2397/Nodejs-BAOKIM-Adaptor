var express = require("express");
var router = express.Router();
var {
  sendToPaymentgateway,
  setCheckUserInfoData,
  setTransfer,
  setCheckTransStatus,
} = require("../services/disbursement");
var fs = require("fs");
var yaml = require("js-yaml");
var config = yaml.safeLoad(
  fs.readFileSync("./config/config copy.yaml", "utf8")
);

var url = config.disbursement.urlapptest;

router.post("/checkuserinfo", async function (req, res) {
  data = setCheckUserInfoData(req.body);
  paymentgatewayResp = await sendToPaymentgateway(url, data);
  res.json(paymentgatewayResp);
});

router.post("/transfer", async function (req, res) {
  data = setTransfer(req.body);
  paymentgatewayResp = await sendToPaymentgateway(url, data);
  res.json(paymentgatewayResp);
});

router.post("/checktransactionstatus", async function (req, res) {
  data = setCheckTransStatus(req.body);
  paymentgatewayResp = await sendToPaymentgateway(url, data);
  res.json(paymentgatewayResp);
});

module.exports = router;
