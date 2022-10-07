const app = require("./app.js");
const config = require("./api/config");
const logger = require("./api/utils/helpers/logger");

// Arrow function to show logger
const serverInfo = () => {
	logger.info(
		`🏁 Server running on ${config.api.host}:${config.api.port} 🏁`,
	);
};

//Server launcher
function runServer() {
	app.listen(config.api.port, serverInfo);
}

runServer();
