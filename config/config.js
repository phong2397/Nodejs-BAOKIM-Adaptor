require("dotenv").config();
const yaml = require("js-yaml");
const fs = require("fs");
const appRootPath = require("app-root-path");

var loadConfig = () => {
  var env = process.env.NODE_ENV;
  var env = "production";
  console.log(env);
  var path = "";
  switch (env) {
    case "production":
      path = `${appRootPath}/config/config.prod.yaml`;
      break;

    case "test":
      path = `${appRootPath}/config/config.test.yaml`;
      break;

    default:
      path = `${appRootPath}/config/config.dev.yaml`;
  }

  return yaml.safeLoad(fs.readFileSync(path, "utf-8"));
};

var config = loadConfig();

module.exports = {
  config: config,
};
