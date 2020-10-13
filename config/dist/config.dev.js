"use strict";

require("dotenv").config();

var yaml = require("js-yaml");

var fs = require("fs");

var appRootPath = require("app-root-path");

var loadConfig = function loadConfig() {
  var env = process.env.NODE_ENV;
  var env = "test";
  console.log(env);
  var path = "";

  switch (env) {
    case "production":
      path = "".concat(appRootPath, "/config/config.prod.yaml");
      break;

    case "test":
      path = "".concat(appRootPath, "/config/config.test.yaml");
      break;

    default:
      path = "".concat(appRootPath, "/config/config.dev.yaml");
  }

  return yaml.safeLoad(fs.readFileSync(path, "utf-8"));
};

var config = loadConfig();
module.exports = {
  config: config
};