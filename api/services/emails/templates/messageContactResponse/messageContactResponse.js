const path = require("path");
const config = require("../../../../config");
const fs = require("fs");
const handlebars = require("handlebars");

const headerBGPathEmail = path.join(config.pathFiles.email.header_bg);

const sendMsgContactResponse = ({ email }) => {
	const emailTemplate = path.join(__dirname, "./messageContactResponse.html");
	const source = fs.readFileSync(emailTemplate, "utf-8").toString();
	const template = handlebars.compile(source);
	const replacements = {
		headerBGPathEmail,
		email,
	};
	const htmlToSend = template(replacements);

	return {
		from: `Luis Quintero Hernandez<${config.nodemailer.auth.user}>`,
		to: email, //["airbusjayrobert@gmail.com", "luisquinterojr10@gmail.com"],
		subject: `Su mensaje ha sido enviado con éxito`,
		text: "Pronto nos pondremos en contacto contigo",
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

module.exports = sendMsgContactResponse;
