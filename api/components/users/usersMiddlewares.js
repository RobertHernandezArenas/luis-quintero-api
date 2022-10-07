// const chalk = require("chalk");
const logger = require("../../utils/helpers/logger");
const model = require("../../database/model");
const response = require("../../routes/response");
const validationSchema = require("./validations");

const USERS_TABLE = "users";

const middlewares = {
	validation: validationSchema,
	async checkIfEmailExists(req, res, next) {
		//
		const { email } = req.body;
		const emailExists = await model.findOne(USERS_TABLE, {
			email: email,
		});

		//
		if (emailExists) {
			logger.error(
				"[ Middleware checkIfEmailExists ]: Existe una cuenta asociada a este correo",
			);

			return response.error(
				req,
				res,
				{ message: "Existe una cuenta asociada a este correo" },
				409,
			);
		}

		return next();
	},

	async checkIfUserNotExists(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if user already exist
		const userExists = await model.findOne(USERS_TABLE, condition());
		if (!userExists) {
			logger.error(
				"[ Middleware checkIfUserNotExists ]: El usuario no existe",
			);

			return response.error(
				req,
				res,
				{
					message: "El usuario no existe",
				},
				400,
			);
		}
		return next();
	},

	async checkIfAccountIsActivated(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if code was already used
		const { is_account_active } = await model.findOne(
			USERS_TABLE,
			condition(),
		);

		if (is_account_active === 1) {
			logger.error(
				"[ Middleware checkIfAccountIsActivated ]: La cuenta ya esta activada",
			);
			return response.error(
				req,
				res,
				{
					message: "La cuenta ya esta activada",
				},
				409,
			);
		}

		return next();
	},
	async checkIfAccountIsDeactivated(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if code was already used
		const { is_account_active } = await model.findOne(
			USERS_TABLE,
			condition(),
		);

		if (is_account_active === 0) {
			logger.error(
				"[ Middleware checkIfAccountIsActivated ]: La cuenta ya esta desactivada",
			);
			return response.error(
				req,
				res,
				{
					message: "La cuenta ya esta desactivada",
				},
				409,
			);
		}

		return next();
	},

	async checkIfThereIsActivationCode(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if code was already used
		const { activation_code } = await model.findOne(USERS_TABLE, condition());

		if (activation_code !== null) {
			logger.error(
				"[ Middleware checkIfAccountIsActivated ]: Se ha enviado un link de confirmación, verifica tu correo para activar tu cuenta",
			);

			return response.error(
				req,
				res,
				{
					message:
						"Se ha enviado un link de confirmación, verifica tu correo para activar tu cuenta",
				},
				409,
			);
		}

		return next();
	},

	async checkIfActivationCodeAreTheSame(req, res, next) {
		//
		const { email } = req.body;
		const { id } = req.params;
		const { code } = req.query;

		const condition = () => {
			if (email === undefined) {
				return { id: id };
			} else {
				return { email: email };
			}
		};

		// check if code was already used
		const { activation_code } = await model.findOne(USERS_TABLE, condition());
		if (activation_code !== code) {
			logger.error(
				"[ Middleware checkIfAccountIsActivated ]: Los codigos de activación no coinciden , solicita un nuevo código",
			);
			return response.error(
				req,
				res,
				{
					message:
						"Los codigos de activación no coinciden, solicita un nuevo código",
				},
				409,
			);
		}

		return next();
	},
};

module.exports = middlewares;
