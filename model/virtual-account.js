const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var virtualAccountSchema = new Schema({
  requestId: String,
  requestTime: String,
  orderId: String,
  amountMin: String,
  amountMax: String,
  expireDate: String,
  accountInfo: {
    BANK: {
      BankName: String,
      BankShortName: String,
      BankBranch: String,
      AccNo: String,
      AccName: String,
    },
  },
});

module.exports = virtualAccountSchema;
