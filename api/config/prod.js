const path = require("path")
require("dotenv").config({

	path: path.join(__dirname, "../../.prod_env")
});

console.log(path.join(__dirname, "../../.prod_env"))

module.exports ={
	api: {
		host: process.env.HOST,
		host_vps: process.env.HOSTVPS,
		port: process.env.FIRST_DEFAULT_PORT || process.env.SECOND_DEFAULT_PORT,
		routes: {
			user: process.env.USER_ROUTES,
		},
	},

	jwt: {
		secret_key: process.env.SECRET_KEY,
		expired_at: process.env.EXPIRATION_TOKEN,
	},
	nodemailer: {
		pool: process.env.POOL_NODEMAILER,
		host: process.env.HOST_NODEMAILER,
		service: process.env.SERVICE_NODEMAILER,
		port: process.env.PORT_NODEMAILER,
		secure: process.env.SECURE_NODEMAILER,
		auth: {
			user: process.env.ADMIN_EMAIL,
			pass: process.env.PASS_GOOGLEAPP_NODEMAILER,
		},
	},
	mysql: {
		connectionLimit: process.env.MYSQL_CONNECTION_LIMITS,
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASSWORD,
		database: process.env.MYSQL_DATABASE,
		timezone: process.env.MYSQL_TIMEZONE,
	},
	pathFiles: {
		logo: process.env.LOGO_IMAGE_PATH,
		avatar: process.env.AVATAR_DEFAULT,
	},
};

console.log("produ 22-33")
