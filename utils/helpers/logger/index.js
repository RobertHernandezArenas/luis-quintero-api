const winston = require("winston");
const path = require("path");
const { format } = require("date-fns");
const { es } = require("date-fns/locale");

const dateNow = new Date();
const formatedDate = format(dateNow, "yyyy-MM-d", { locale: es });
const timeStampLog = format(dateNow, "yyyy-MM-d HH:mm:ss", { locale: es });
const fileName = `${formatedDate}-application-logs.log`;
const logPath = path.join(__dirname, `../../../logs/${fileName}`);
const addDate = winston.format(info => {
	info.message = `${timeStampLog} ${info.message}`;
	return info;
});

const myCustomLevels = {
	levels: {
		info: 0,
		verbose: 1,
		warn: 2,
		error: 3,
	},
	colors: {
		info: "black blueBG",
		verbose: "green",
		warn: "black yellowBG",
		error: "black redBG",
	},
};
winston.addColors(myCustomLevels.colors);
const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			levels: myCustomLevels.levels,
			handleExceptions: true,
			format: winston.format.combine(
				winston.format.colorize(myCustomLevels.colors),
				winston.format.simple(),
			),
		}),
		new winston.transports.File({
			level: "info",
			handleExceptions: true,
			format: winston.format.combine(addDate(), winston.format.simple()),
			maxsize: 5120000, // 5mb
			maxFiles: 5,
			filename: logPath,
		}),
	],
});

module.exports = logger;
