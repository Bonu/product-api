const winston = require('winston');
const { format } = require('winston');
require('winston-daily-rotate-file')

const path = require('path');
const fs = require('fs');
const fileName = path.join(__dirname, "..", "..", "Logs", "web.%DATE%.log");
const dirName = path.dirname(fileName);

if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName);
}

const fileTransport = new (winston.transports.DailyRotateFile)(
    {
        filename: fileName,
        datePattern: 'MM-DD',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        zippedArchive: true,
        maxSize: '50m',
        maxFiles: '30d'
    });

const transports = [
    new (winston.transports.Console)(),
    fileTransport
];


winston.exceptions.handle(fileTransport);

const logger = winston.createLogger({
    transports: transports,
    exitOnError: false,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
    )});

module.exports = logger;