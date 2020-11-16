const Bull = require("bull");
const QUEUE_NAME = process.env.QUEUE_NAME || "work";
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const Queue = new Bull(QUEUE_NAME, REDIS_URL);

var sendPayment = async requestInfo => {
  await Queue.add(requestInfo);
  return true;
};
module.exports = { sendPayment: sendPayment };
