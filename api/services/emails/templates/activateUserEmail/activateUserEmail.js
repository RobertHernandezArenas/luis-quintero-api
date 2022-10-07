const path = require("path");
const config = require("../../../../config");
const fs = require("fs");
const handlebars = require("handlebars");

const imagePathEmail = path.join(config.pathFiles.logo);
const headerBGPathEmail = path.join(config.pathFiles.email.header_bg);
const queryCode = "activate?code=";

const activateMail = data => {
	const { host_vps, users_route_name, host, port } = config.api;
	const loginLink = `${host}:${port}/${users_route_name}/${data.id}/${queryCode}${data.activation_code}`;

	const emailTemplate = path.join(__dirname, "./activateUsersEmail.html");
	const source = fs.readFileSync(emailTemplate, "utf-8").toString();
	const template = handlebars.compile(source);
	const replacements = {
		imagePathEmail,
		loginLink,
		headerBGPathEmail
	};
	const htmlToSend = template(replacements);

	return {
		from: `Luis Quintero Web<${config.nodemailer.auth.user}>`,
		to: `${data.email}`,
		subject: "✅ Tu cuenta ha sido activada con éxito",
		text: "Bienvenido! ...Y gracias por registrarte a mi web ⚽",
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

module.exports = activateMail;
