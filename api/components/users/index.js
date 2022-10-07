const usersControllers = require("./usersControllers");
const store = require("../../database/model");

module.exports = usersControllers(store);
