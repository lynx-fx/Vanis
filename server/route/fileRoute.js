const express = require("express");
const router = express.Router();
const fileController = require("../controller/fileController.js")
const upload = require("../middleware/multer.js")

router.get("/getFiles", upload.array("file",10), fileController.getFiles);
router.post("/uploadFiles", fileController.uploadFiles);