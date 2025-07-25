const File = require("../model/fileModel.js");
const generateCode = require("../utility/codeGenerator.js");

exports.uploadFiles = async (req, res) => {
  const files = req.files;
  const fileCodes = [];
  const { lifeSpan } = req.body;

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
      lifeSpan,
    });
    await newFile.save();
    fileCodes.push(code);
  }

  return res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    fileCodes,
    folderCode,
  });
};

// DONE: Complete get files
exports.getFiles = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ success: false, message: "Code required" });
  }

  const existingFile = await File.find({ code });

  if (!existingFile) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  return res.status(200).json({ success: true, existingFile });
};

// DONE: Complete get folder
exports.getFolder = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ success: false, message: "Code requried" });
  }

  const existingFiles = await File.find({ code });

  if (!existingFiles) {
    return res.status(404).json({ success: false, message: "No files found" });
  }

  return res.status(200).json({ success: true, existingFiles });
};

exports.checkValidity = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ success: false, message: "Code required" });
  }

  const existingFile = await File.findOne({ code });

  if (!existingFile) {
    return res.status(404).json({ success: false, message: "File not found" });
  } else {
    const expiresAt = new Date(
      existingFile.createdAt.getTime() + existingFile.lifeSpan * 60 * 60 * 1000
    );

    if (expiresAt < new Date) {
      // delete the file from system
      await File.findByIdAndDelete(existingFile.id);
      return
    }
  }
};

