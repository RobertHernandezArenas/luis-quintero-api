const usersControllers = require("../../users");
const response = require("../../../routes/response");
const { v4: uuidV4 } = require("uuid");
const sendEmail = require("../../../services/emails");
const emailTemplates = require("../../../services/emails/templates");
const helpers = require("../../../utils/helpers");
const bcrypt = require("bcrypt");
const usersStore = require("../../../database/model");

const USERS_TABLE = "users";
const DATA_USERS_TABLE = "dataUsers";

const userRoutes = {
	create: async (req, res, next) => {
		const { body } = req;
		try {
			const users = {
				id: uuidV4(),
				email: body.email.toLowerCase().trim(),
				password: await bcrypt.hash(body.password, 10),
				activation_code: helpers.randomString(20),
				create_at: new Date(),
			};

			const userData = {
				image: helpers.randomAvatar(),
				users_id: users.id,
			};

			const usersResult = await usersStore.create(USERS_TABLE, users);
			const usersDataResult = await usersStore.create(
				DATA_USERS_TABLE,
				userData,
			);

			const result = usersResult == 1 && usersDataResult == 1;

			if (result == false) {
				return response.error(
					req,
					res,
					"Ha ocurrido un error en la base de datos",
					500,
				);
			}

			const mailOptions = emailTemplates.new_user(users);
			sendEmail(mailOptions);

			response.success(
				req,
				res,
				{ message: "Cuenta creada correctamente" },
				201,
			);
		} catch (error) {
			next(error);
		}
	},

	findAll: async (req, res, next) => {
		try {
			const users = await usersStore.findAll(DATA_USERS_TABLE);
			response.success(req, res, users, 200);
		} catch (error) {
			next(error);
		}
	},

	findOne: async (req, res, next) => {
		try {
			const { id } = req.params;
			const user = await usersStore.findOne(DATA_USERS_TABLE, {
				users_id: id,
			});
			response.success(req, res, user, 200);
		} catch (error) {
			next(error);
		}
	},

	update: async (req, res, next) => {
		try {
			//
			const userDataDB = await usersStore.findOne(USERS_TABLE, { id: id });

			const user = {
				name: helpers.capitalize(
					(body.name || userDataDB.name).toLowerCase().trim(),
				),
				surname: helpers.capitalize(
					(body.surname || userDataDB.surname).toLowerCase().trim(),
				),
				address: helpers.capitalize(
					(body.address || userDataDB.address).toLowerCase().trim(),
				),
				telephone: body.telephone || userDataDB.telephone,
				country: helpers.capitalize(
					(body.country || userDataDB.country).toLowerCase().trim(),
				),
				city: helpers.capitalize(
					(body.city || userDataDB.city).toLowerCase().trim(),
				),
			};

			usersStore.update(USERS_TABLE, user, { id: id });
			response.success(req, res, { mesagge: "Datos actualizados" }, 200);
		} catch (error) {}
	},

	remove: async (req, res, next) => {
		try {
			const { id } = req.params;

			const { email } = await usersStore.findOne(USERS_TABLE, { id: id });

			const mailOptions = emailTemplates.delete_user({ email: email });
			await sendEmail(mailOptions);

			await usersStore.remove(USERS_TABLE, { id: id });

			response.success(
				req,
				res,
				{ message: "Datos borrados con éxito" },
				200,
			);
		} catch (error) {
			next(error);
		}
	},

	activate: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { email } = await usersStore.findOne(USERS_TABLE, { id: id });

			const userActivation = {
				is_account_active: 1,
				activation_code: null,
			};
			console.log(
				"results:::> ",
				await usersStore.update(USERS_TABLE, userActivation, { id: id }),
			);
			await usersStore.update(USERS_TABLE, userActivation, { id: id });
			response.success(
				req,
				res,
				{ message: "La cuenta ha sido activada correctamente" },
				200,
			);

			const mailOptions = emailTemplates.activate_user({ email: email });
			await sendEmail(mailOptions);
		} catch (error) {
			next(error);
		}
	},

	deactivate: async (req, res, next) => {
		try {
			const { id } = req.params;
			const { email } = await usersStore.findOne(USERS_TABLE, { id: id });

			const userDeactivation = {
				is_account_active: 0,
				activation_code: null,
			};

			await usersStore.update(USERS_TABLE, userDeactivation, { id: id });
			response.success(req, res, { message: "Cuenta desactivada" }, 200);

			const mailOptions = emailTemplates.deactivate_user({ email: email });
			await sendEmail(mailOptions);
		} catch (error) {
			next(error);
		}
	},
	newCode: async (req, res, next) => {
		try {
			const { email } = req.body;
			console.log(email);
			const { id } = await usersStore.findOne(USERS_TABLE, { email: email });

			const user = {
				id: id,
				email: email.trim().toLowerCase(),
				activation_code: helpers.randomString(20),
			};

			await usersStore.update(USERS_TABLE, user, { email: user.email });
			response.success(req, res, { message: "Código Enviado" }, 200);

			const mailOptions = emailTemplates.new_code_user(user);
			await sendEmail(mailOptions);
		} catch (error) {
			next(error);
		}
	},

	sendMessageContact: async (req, res, next) => {
		try {
			const capi = str => str.charAt(0).toUpperCase() + str.slice(1);

			const { fullname, email, subject, message } = req.body;
			const messageEmail = {
				fullname: helpers.capitalize(fullname),
				email: email.toLowerCase(),
				subject: capi(subject.toLowerCase()),
				message: capi(message.toLowerCase()),
			};
			const mailOptions = emailTemplates.contactMessage(messageEmail);
			await sendEmail(mailOptions);

			const mailOptions1 =
				emailTemplates.contactMessageResponse(messageEmail);
			await sendEmail(mailOptions1);

			response.success(
				req,
				res,
				{ message: "El mensaje ha sido enviado con éxito" },
				200,
			);
		} catch (error) {
			next(error);
		}
	},
};

module.exports = userRoutes;
