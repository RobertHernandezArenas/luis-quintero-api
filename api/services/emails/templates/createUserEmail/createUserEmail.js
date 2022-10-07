const path = require("path");
const config = require("../../../../config");
const fs = require("fs");
const handlebars = require("handlebars");

const imagePathEmail = path.join(config.pathFiles.logo);
const headerBGPathEmail = path.join(config.pathFiles.email.header_bg);
const queryCode = "activate?code=";

const addMail = data => {
	const { host_vps, users_route_name, host, port } = config.api;
	const activationLink = `${host}:${port}/${users_route_name}/${data.id}/${queryCode}${data.activation_code}`;

	const emailTemplate = path.join(__dirname, "./createUsersEmail.html");
	const source = fs.readFileSync(emailTemplate, "utf-8").toString();
	const template = handlebars.compile(source);
	const replacements = {
		imagePathEmail,
		activationLink,
		headerBGPathEmail
	};
	const htmlToSend = template(replacements);

	return {
		from: `Luis Quintero Web<${config.nodemailer.auth.user}>`,
		to: `${data.email}`,
		subject: "🔴 Confirmación de la cuenta",
		text: "Haz click en el boton para activar la cuenta!",
		html: htmlToSend,
		attachments: [
			{
				filename: "header-bg.jpg",
				path: headerBGPathEmail,
				cid: "headerbg",
			},
		],
	};
};

module.exports = addMail;
