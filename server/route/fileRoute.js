const express = require("express");
const router = express.Router();
const fileController = require("../controller/fileController.js");
const upload = require("../middleware/multer.js");

router.post(
  "/uploadFiles",
  upload.array("files", 20),
  fileController.uploadFiles
);
router.get("/getFile", fileController.getFiles);
router.get("/getFolder", fileController.getFolder);

module.exports = router;
