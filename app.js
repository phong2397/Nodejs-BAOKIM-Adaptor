var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var loggerBody = require("morgan-body");
var indexRouter = require("./routes/index");
var disbursementsRoute = require("./routes/disbursement");
var virtualAccountRoute = require("./routes/virtual-account");
var logger = require("./utils/winston/winston");
const axios = require("axios");
const AxiosLogger = require("axios-logger");
var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
//Axios Log
//TODO: Need format logs
axios.interceptors.request.use(request => {
  return AxiosLogger.requestLogger(request, {
    dateFormat: "isoUtcDateTime",
    status: false,
    headers: true,
    logger: logger.loggerConsole("LOGGER").info,
  });
});

axios.interceptors.response.use(response => {
  return AxiosLogger.responseLogger(response, {
    dateFormat: "isoUtcDateTime",
    status: false,
    headers: true,
    logger: logger.loggerConsole("LOGGER").info,
  });
});

//File log
loggerBody(app, {
  logReqHeaderList: true,
  logAllReqHeader: true,
  logResHeaderList: true,
  logAllResHeader: true,
  logReqDateTime: false,
  noColors: true,
  prettify: false,
  stream: {
    write: (message, encoding) => {
      logger.loggerFile("LOGGER").info(message);
    },
  },
});
//Console log
loggerBody(app, {
  logReqHeaderList: true,
  logAllReqHeader: true,
  logResHeaderList: true,
  logAllResHeader: true,
  logReqDateTime: false,
  noColors: false,
  prettify: false,
  stream: {
    write: (message, encoding) => {
      logger.loggerConsole("LOGGER").info(message);
    },
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "logs")));
app.use("/", indexRouter);
app.use("/logs", express.static(path.join(__dirname, "logs")));
app.use("/virtualaccount", virtualAccountRoute);
app.use("/disbursement", disbursementsRoute);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res
    .status(err.status || 500)
    .json({ status: err.status, message: err.message });
});

module.exports = app;
