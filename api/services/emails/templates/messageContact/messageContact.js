const path = require("path");
const config = require("../../../../config");
const fs = require("fs");
const handlebars = require("handlebars");

const headerBGPathEmail = path.join(config.pathFiles.email.header_bg);

const addMail = ({ fullname, email, subject, message }) => {
	const emailTemplate = path.join(__dirname, "./messageContact.html");
	const source = fs.readFileSync(emailTemplate, "utf-8").toString();
	const template = handlebars.compile(source);
	const replacements = {
		headerBGPathEmail,
		fullname,
		email,
		subject,
		message,
	};
	const htmlToSend = template(replacements);

	return {
		from: `Luis Quintero Web<${config.nodemailer.auth.user}>`,
		to: "luisquinterojr10@gmail.com", //["airbusjayrobert@gmail.com", "luisquinterojr10@gmail.com"],
		subject: `Haz recibido un mensaje de ${fullname} desde Luis Quintero Web`,
		text: "Haz click en el boton para leer el mensaje",
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
