require("dotenv").config();

const environment = process.env.NODE_ENV || process.argv[2];

const defaultConfig = {
	api: {
		host: process.env.HOST,
		host_vps: process.env.HOSTVPS,
		base_url_api: process.env.BASE_API_URL,
		users_route_name: process.env.USERS_ROUTE,
		newsletters_route_name: process.env.NEWSLETTERS_ROUTE,
		emails_route_name: process.env.EMAILS_ROUTE,
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
		tls: {
			rejectUnauthorized: false,
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
		email: {
			header_bg: process.env.HEADERBG_IMAGE_PATH,
		},
	},
};

let environmentConfig = {};

switch (environment) {
	case "desarrollo":
	case "dev":
	case "development":
		environmentConfig = require("./dev");
		break;
	case "produccion":
	case "prod":
	case "production":
		environmentConfig = require("./prod");
		break;
	case "stage":
	case "test":
		environmentConfig = require("./stage");
		break;
	default:
		environmentConfig = require("./dev");
}

const config = {
	...defaultConfig,
	...environmentConfig,
};

module.exports = config;
