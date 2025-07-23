const File = require("../model/fileModel.js");
const generateCode = require("../utility/codeGenerator.js");

exports.uploadFiles = async (req, res) => {
  const files = req.files;
  const fileCodes = [];

  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, message: "No files found." });
  }

  if (!req.session.folderCode) {
    req.session.folderCode = generateCode(8);
  }

  const folderCode = req.session.folderCode;

  for (const file of files) {
    const code = generateCode();
    const newFile = new File({
      fileName: file.filename,
      fileUri: file.filename,
      code,
      folder: folderCode,
    });
    await newFile.save();
    fileCodes.push(code);
  }

  return res
    .status(200)
    .json({
      success: true,
      message: "Files uploaded successfully",
      fileCodes,
      folderCode,
    });
};

// TODO: Complete get files
exports.getFiles = (req, res) => {};
