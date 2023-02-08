const routerx = require("express-promise-router");
const middlewares = require("../usersMiddlewares");
const usersCallbackRoutes = require("./usersCallbackRoutes");
const cors = require("cors");

const router = routerx();

router
	.post(
		"/",
		middlewares.checkIfEmailExists,
		middlewares.validation.create,
		usersCallbackRoutes.create,
	)
	.get("/", usersCallbackRoutes.findAll)

	.get("/:id", middlewares.checkIfUserNotExists, usersCallbackRoutes.findOne)

	.get(
		"/:id/activate",
		middlewares.checkIfUserNotExists,
		middlewares.checkIfAccountIsActivated,
		middlewares.checkIfActivationCodeAreTheSame,
		usersCallbackRoutes.activate,
	)

	.delete(
		"/:id/delete",
		middlewares.checkIfUserNotExists,
		usersCallbackRoutes.remove,
	)

	.get(
		"/:id/deactivate",
		middlewares.checkIfUserNotExists,
		middlewares.checkIfAccountIsDeactivated,
		usersCallbackRoutes.deactivate,
	)
	.post(
		"/new-activation-code",
		middlewares.checkIfAccountIsActivated,
		middlewares.checkIfThereIsActivationCode,
		usersCallbackRoutes.newCode,
	)
	.post("/message", usersCallbackRoutes.sendMessageContact);

module.exports = router;
