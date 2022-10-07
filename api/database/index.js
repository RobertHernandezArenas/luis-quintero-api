const config = require("../config");
// const mysql = await import("mysql2/promise");
const mysql = require("mysql2/promise");

let pool;

async function getConnection() {
	if (!pool) {
		pool = mysql.createPool(config.mysql);
	}
	return await pool.getConnection();
}

/* !pool ? (pool = mysql.createPool(config.mysql)) : await pool.getConnection();*/

// module.exports = pool;

module.exports = getConnection;
