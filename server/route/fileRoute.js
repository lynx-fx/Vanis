const express = require("express");
const router = express.Router();
const fileController = require("../controller/fileController.js");
const upload = require("../middleware/multer.js");

router.post(
  "/uploadFiles",
  upload.array("files", 20),
  fileController.uploadFiles
);
router.get("/getFile", fileController.getFile);
router.get("/getFolder", fileController.getFolder);
router.get("/getOwnerFolder", fileController.getOwnerFolder);
router.get("/downloadFile/:fileName", fileController.downloadFile);

module.exports = router;
