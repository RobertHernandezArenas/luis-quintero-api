const fs = require( "fs");
const helpers = require( "../../helpers");
const { format } = require( "date-fns");
const { es } = require( "date-fns/locale");

const dateNow = new Date();
const formatedHour = format(dateNow, `yyyy-MM-d HH:mm:ss`, { locale: es });

async function checkFileExist(pathFile, info = "") {
	const conditionExist = error => {
		if (error) {
			helpers.createFile(pathFile, `${formatedHour} - ${info}\n`);
			//console.log("FROM CHECKFILE EXIST: El archivo no existe");
		} else {
			helpers.checkFileSize(pathFile, info);
			helpers.addTextFile(pathFile, `${formatedHour} - ${info}\n`);
			//console.log("ya existe");
		}
	};

	fs.access(pathFile, fs.F_OK, conditionExist);
}

module.exports = checkFileExist;
