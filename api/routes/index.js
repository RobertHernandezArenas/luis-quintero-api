const ErrorRoutes = require("./ErrorRoutes");
const routerx = require("express-promise-router");
const swaggerUI = require("swagger-ui-express");
const swaggerDOC = require("../doc/swagger.json");
const usersRouter = require("../components/users/usersRoutes");
const config = require("../config");
const path = require("path")

const options = {
	//customCss: ".swagger-ui .topbar { display: none } ",
};
const router = routerx();

router
	.get("/", (req, res) => {
		res.status(200).json({api: "Welcome to my API"})
	})
	// .use("/", swaggerUI.serve, swaggerUI.setup(swaggerDOC, options))

	.use("/users", usersRouter)

	.use(ErrorRoutes.notFound)
	
	.use(ErrorRoutes.previous)

module.exports = router;
