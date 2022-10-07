const { createTransport, getTestMessageUrl } = require("nodemailer");
const config = require("../../config");

async function sendEmail(mailOptions) {
	try {
		const transporter = createTransport(config.nodemailer);
		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.log("nodemailer sendemail:::>", error.message);
		return false; //error;
	}
}

module.exports = sendEmail;
