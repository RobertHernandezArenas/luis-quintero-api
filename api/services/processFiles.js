const sharp = require("sharp");
const logger = require("../helpers/logger");
const fsExtra = require("fs-extra");
const path = require("path");
const { v1: uuidv1 } = require("uuid");
const locationNamefile = path.parse(__filename).base;

async function processFiles(uploadedImage) {
	try {
		// Random File name to be saved
		const savedFileName = `${uuidv1()}.jpg`;

		// Ensure the uploads path exists
		await fsExtra.ensureDir(uploadedImage.path);

		// Process image
		const finalImage = sharp(uploadedImage.file.data);

		//Make sure image is not wider than 500px
		let imageInfo = await finalImage.metadata();

		if (
			imageInfo.width > uploadedImage.width &&
			imageInfo.height > uploadedImage.height
		) {
			finalImage.resize(uploadedImage.width, uploadedImage.height);
		}

		// Save image
		await finalImage.toFile(path.join(uploadedImage.path, savedFileName));

		return savedFileName;
	} catch (error) {
		logger.error(
			`[${locationNamefile}] || Block code: [processFiles] \n Line [35] Ha ocurrido un error al procesar la imagen: [ ${uploadedImage.file} ]`,
		);
		return error;
	}
}

module.exports = processFiles;
