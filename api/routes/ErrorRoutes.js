const logger = require("../utils/helpers/logger");

function previous(error, response) {
	logger.error("[ERROR ROUTES PREVIOUS] :::>", error.message);

	response.status(error.httpCode || 500).json({
		status: error.httpCode || 500,
		body: false,
		error: {
			message: error.message || "Ha ocurrido un error en el servidor",
		},
	});
}

function notFound(request, response) {
	logger.error("[404] => Pagina no encontrada");
	response.status(404).send({
		message: "Pagina no encontrada",
		comment: "¿Te has Perdido?",
	});
}

module.exports = {
	previous,
	notFound,
};
