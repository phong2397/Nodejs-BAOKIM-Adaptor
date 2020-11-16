var winston = require("winston");
var appRoot = require("app-root-path");
require("winston-daily-rotate-file");
const { combine, timestamp, label, printf, prettyPrint } = winston.format;

const consoleFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

var options = {
  file: {
    level: "info",
    filename: "logs/app.log",
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 10,
    colorize: false,
  },
  console: {
    level: "debug",
    format: consoleFormat,
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};
var loggerConsole = _label => {
  var _logger = winston.createLogger({
    format: combine(label({ label: _label }), timestamp(), consoleFormat),
    transports: [new winston.transports.Console()],
    exitOnError: false, // do not exit on handled exceptions
  });

  _logger.stream = {
    write: function (message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      _logger.info(message.replace(/\r?\n|\r/g, " "));
    },
  };
  return _logger;
};
var loggerFile = _label => {
  var _logger = winston.createLogger({
    format: combine(label({ label: _label }), timestamp(), consoleFormat),
    transports: [
      new winston.transports.DailyRotateFile({
        filename: "application-%DATE%.log",
        dirname: `${appRoot}/logs/`,
        level: "info",
        json: false,
        zippedArchive: true,
        maxSize: "20m",
      }),
      new winston.transports.File(options.file),
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  _logger.stream = {
    write: function (message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports (file and console)
      _logger.info(message.replace(/\r?\n|\r/g, " "));
    },
  };
  return _logger;
};

module.exports = { loggerConsole, loggerFile };
