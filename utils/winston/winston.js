var winston = require("winston");
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

var logger = (_label) => {
  var _logger = winston.createLogger({
    format: combine(label({ label: _label }), timestamp(), consoleFormat),
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
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

module.exports = logger;
