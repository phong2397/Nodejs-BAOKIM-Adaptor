const throng = require("throng");
const appRootPath = require("app-root-path");
const { config } = require(`${appRootPath}/config/config`);
const Queue = require("bull");
const axios = require("axios");
const TRANSFERMONEY_URL = config.baokim.transferMoneyUrl;
console.log(TRANSFERMONEY_URL);
const QUEUE_NAME = process.env.QUEUE_NAME || "work";
// Connect to a local redis instance locally, and the Heroku-provided URL in production
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
// Spin up multiple processes to handle jobs to take advantage of more CPU cores
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
const workers = process.env.WEB_CONCURRENCY || 2;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function start() {
  console.log("WORKER: ON");
  // Connect to the named work queue
  let workQueue = new Queue(QUEUE_NAME, REDIS_URL);

  workQueue.process(maxJobsPerWorker, async job => {
    let requestInfo = {
      RequestId: "BK20201015622",
      RequestTime: "2020-10-15 17:17:20",
      PartnerCode: "VAYSV",
      Operation: 9002,
      ReferenceId: "BK20201015622555",
      BankNo: "970457",
      AccNo: "100100132448",
      AccType: 0,
      RequestAmount: "50000",
      Memo: "Test chuyen tien",
      Signature:
        "c3YJgDCSuC0IBgauJJLdVWWFNH2rKIi2N0Xvpk4wZm0xaVaTHRlR0RvqtmH5egSErW1/5mVJi2sLdnju3artI2E7UdBx5eTiKNzGhxWrWPOxDLLCR/QnfcBChJLaf5GO4xMWKCLIeZ2x98iPPxwpqiPswrmi9CeFhrUP9qCiTZk=",
    };
    let headers = {
      "Content-Type": "application/json",
    };
    let res = await axios.post(TRANSFERMONEY_URL, requestInfo, {
      headers,
    });
    //TODO: Need store data to db if success
    return { id: job.id, value: res.data };
  });
}
// start();
// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
