const { format } = require("date-fns");
const { es } = require("date-fns/locale");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const config = require("../../config");

const helpers = {
	formatDateToDB: date => {
		return format(date, `yyyy-MM-dd HH:mm:ss`);
	},
	formatDateJSON: date => {
		return format(date, `yyyy-MM-dd 'T' HH:mm:ss.SSSxxx`);
	},
	formatDate4Vue: date => {
		return format(date, `dd 'de' MMM 'de' yyyy HH:mm:ss`, {
			locale: es,
		});
	},

	errorGenerator: (message, code) => {
		const error = new Error(message);
		if (code) error.statusCode = code;
		return error;
	},

	randomString: (size = 20) => {
		return crypto.randomBytes(size).toString("hex").slice(0, size);
	},

	createFolder: pathFolderName => {
		try {
			fs.mkdirSync(process.cwd() + `${pathFolderName}`, {
				recursive: true,
			});
			console.log(`Directorio creado con exito`);
		} catch (error) {
			return error;
		}
	},

	renameFolder: (oldPathDirName, newPathDirName) => {
		try {
			fs.renameSync(oldPathDirName, newPathDirName);
		} catch (error) {
			return error;
		}
	},

	deleteFolder: pathFolder => {
		try {
			fs.rmdir(`${pathFolder}`, {
				recursive: true,
			});
		} catch (error) {
			return error;
		}
	},
	firstLetterUpper: str => {
		str = str.split(" ");
		let h = [];

		str.map((str, i) => {
			if (i == 0) {
				str = str.charAt(0).toUpperCase() + str.slice(1);
			}
			h.push(str);
		});
		return h.join().replaceAll(",", " ");
	},

	eachWordLetterUpper: str => {
		let h = str.split(" ");
		h = h.map(h => {
			return h.charAt(0).toUpperCase() + h.slice(1);
		});
		return h.join().replaceAll(",", " ");
	},

	getPathFile: nameFile => {
		let pathFile = path.join(__dirname, nameFile);
		return pathFile;
	},

	createFile: (pathFile, info) => {
		const condition = error => {
			if (error) {
				console.log("Archivo creado");
			}
		};
		fs.writeFile(pathFile, info, condition);
	},
	addTextFile: (pathFile, info) => {
		const condition = error => {
			if (error) {
				console.log("Texto Añadido");
			}
		};
		fs.appendFile(pathFile, info, condition);
	},

	deleteFile: pathFile => {
		fs.unlink(pathFile, error => {
			if (!error) {
				console.log("El archivo se borro correctamente");
			} else {
				console.log("El archivo no se ha podido borrar");
			}
		});
	},
	checkFileSize: (pathFile, info) => {
		fs.stat(pathFile, (error, stats) => {
			//console.log(`Peso en bytes del archivo ${stats.size} bytes`);
			if (!error && stats.size >= 5242880) {
				helpers.deleteFile(pathFile);
			}
		});
	},

	randomAvatar: () => {
		// Creamos variable que se encargara de asignar una imagen aleatoria a cada usuario que no envie imagen
		let randomImage = Math.floor(Math.random() * 8) + 1;

		// Creacion del nombre del archivo ex: avatar-5.jpg
		const avatarImage = "avatar-" + `${randomImage}` + ".jpg";

		// creamos path del archivo
		const pathImageDefault = path.join(
			//__dirname,
			//	config.api.host,
			config.pathFiles.avatar,
			`./${avatarImage}`,
		);
		//console.log("ESTE ES DEFAULT PATH IMAGE", pathImageDefault);
		// Asignamos este valor a image y este a su vez a savedFileName para que salga de la condicion null || undefined con el valor que le hemos asigando por defecto
		return pathImageDefault;
	},
};
module.exports = helpers;
