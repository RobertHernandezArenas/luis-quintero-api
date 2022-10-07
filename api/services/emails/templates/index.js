const createUserEmail = require("./createUserEmail/createUserEmail");
const deleteUserEmail = require("./deleteUserEmail");
const activateUserEmail = require("./activateUserEmail/activateUserEmail");
const deactivateUserEmail = require("./deactivateUserEmail");
const newCodeUserEmail = require("./newCodeUserEmail/newCodeUserEmail");
const messageContact = require("./messageContact/messageContact");
const messageContactResponse = require("./messageContactResponse/messageContactResponse");

const emailTemplates = {
	new_user: createUserEmail,
	delete_user: deleteUserEmail,
	activate_user: activateUserEmail,
	deactivate_user: deactivateUserEmail,
	new_code_user: newCodeUserEmail,
	contactMessage: messageContact,
	contactMessageResponse: messageContactResponse,
};

module.exports = emailTemplates;
