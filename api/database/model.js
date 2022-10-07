const getConnection = require("../database");
const logger = require("../utils/helpers/logger");

let connectionDB;

function multipleColumnSet(object) {
	if (typeof object !== "object") {
		throw new Error("Invalid input");
	}

	const keys = Object.keys(object);
	const values = Object.values(object);

	let columnSet = keys.map(key => `${key} = ?`).join(", ");

	return {
		columnSet,
		values,
	};
}

const model = {
	findAll: async TABLE => {
		console.log("hola db")
		connectionDB = await getConnection();
		let [result] = await connectionDB.query(`SELECT * FROM ${TABLE}`);

		if (result.length === 0) {
			result = {
				message: "No hay resultados",
			};
		}

		if (connectionDB) {
			connectionDB.release();
		}

		return result;
	},

	findOne: async (tableName, params) => {
		connectionDB = await getConnection();
		const { columnSet, values } = multipleColumnSet(params);

		const sql = `SELECT * FROM ${tableName}
        WHERE ${columnSet}`;

		const [result] = await connectionDB.query(sql, [...values]);

		if (connectionDB) {
			connectionDB.release();
		}

		return result[0];
	},
	create: async (table, data) => {
		let errorDB = new Error("Ha ocurrido un error en el servidor");
		try {
			connectionDB = await getConnection();

			const [result] = await connectionDB.query(
				`
			INSERT INTO ${table} SET ?`,
				[data],
			);

			return result ? result.affectedRows : 0;
		} catch (error) {
			logger.error(`[CREATE MODEL DB] :::> ${error.message}`);
			return 0;
		}
	},

	update: async (tableName, user, id) => {
		connectionDB = await getConnection();
		const { columnSet, values } = multipleColumnSet(user);
		const { columnSet: condition, values: cValues } = multipleColumnSet(id);
		let sql = `
			UPDATE ${tableName} SET ${columnSet} WHERE ${condition}`;

		const [result] = await connectionDB.query(sql, [...values, cValues]);
		const affectedRows = result ? result.affectedRows : 0;

		return affectedRows;
	},
	remove: async (tableName, id) => {
		connectionDB = await getConnection();
		console.log("db id llega",id)
		const { columnSet, values } = multipleColumnSet(id);

		const sql = `DELETE FROM ${tableName}
        WHERE ${columnSet}`;

		const [result] = await connectionDB.query(sql, [...values]);

		if (connectionDB) {
			connectionDB.release();
		}
		return result[0] || null;
	},
};

module.exports = model;
