const cors = require("cors");
const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const path = require("path");
const router = require("./api/routes");

const publicFolder = express.static(path.join(__dirname, "public"));
const app = express();

// APPLICATION CONFIG
app.use(morgan("dev"))

	.use(cors())

	.use(fileUpload())

	.use(express.json())

	.use(express.urlencoded({ extended: true }))

	.use(publicFolder)

	.use("/", router);

module.exports = app;
