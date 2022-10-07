const { v4: uuidV4 } = require("uuid");
const sendEmail = require("../../services/emails");
const emailTemplates = require("../../services/emails/templates");
const helpers = require("../../utils/helpers");
const bcrypt = require("bcrypt");
const response = require("../../routes/response");

const USERS_TABLE = "users";
const DATA_USERS_TABLE = "dataUsers";

module.exports = function (injectedStore) {
	let usersStore = injectedStore;
	if (!usersStore) {
		usersStore = require("../../database/dummy");
	}

	async function create(body) {
		let errorController = helpers.errorGenerator(
			"Ha ocurrido un error en el controlador",
			500,
		);
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
				throw errorController.message;
			}

			const mailOptions = emailTemplates.new_user(users);
			sendEmail(mailOptions);

			return { mesagge: "Cuenta creada con éxito" };
		} catch (error) {
			console.log(`[CONTROLLER ERROR HANDLING] :::> ${error.message}`)
			throw errorController.message;
		}
	}

	async function findAll() {
		return usersStore.findAll(DATA_USERS_TABLE);
	}

	async function findOne(body) {
		let { id } = body.params;
		return usersStore.findOne(DATA_USERS_TABLE, { users_id: id });
	}

	async function remove(id) {
		//
		const { email } = await store.findOne(USERS_TABLE, { id: id });

		//
		const mailOptions = emailTemplates.delete_user({ email: email });
		await sendEmail(mailOptions);

		//
		await authentication.remove({ id: id });

		//
		return store.remove(USERS_TABLE, { id: id });
	}

	async function activate(body, next) {
		try {
			//
		const {id} = body.params;
		const { email } = await usersStore.findOne(USERS_TABLE, { id: id });

		
		const mailOptions = emailTemplates.activate_user({ email: email });
		await sendEmail(mailOptions);
		
		const userActivation = {
			is_account_active: 1,
			activation_code: null,
		};
		console.log("results:::> ", await usersStore.update(USERS_TABLE, userActivation, { id: id }))
		return await usersStore.update(USERS_TABLE, userActivation, { id: id });
		 
			
		} catch (error) {
			return next()
		}
	}

	async function deactivate(id) {
		//
		const { email } = await store.findOne(USERS_TABLE, { id: id });

		//
		const mailOptions = emailTemplates.deactivate_user({ email: email });
		await sendEmail(mailOptions);

		//
		const userDeactivation = {
			is_account_active: 0,
			activation_code: null,
		};

		return await store.update(USERS_TABLE, userDeactivation, { id: id });
	}


	return {
		create,
		findAll,
		findOne,
		activate
	};
};
