const File = require("../model/fileModel.js");
const generateCode = require("../utility/codeGenerator.js");
const frontend =
  process.env.NODE_ENV == "production"
    ? process.env.FRONT_END_HOSTED
    : process.env.FRONT_END_LOCAL;
const path = require("path");
const fs = require("fs");

// TODO: Get actual filename instead of unique names
exports.uploadFiles = async (req, res) => {
  const files = req.files;
  const { lifeSpan } = req.body;
  const uploadedFiles = [];

  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, message: "No files found." });
  }

  if (!req.session.folderCode) {
    req.session.folderCode = generateCode(8);
  }

  const folderCode = req.session.folderCode;

  for (const file of files) {
    const code = generateCode();
    const downloadUrl = `${frontend}/download/file?${code}`;
    const newFile = new File({
      fileName: file.filename,
      code,
      folder: folderCode,
      lifeSpan,
      size: file.size,
      downloadUrl,
    });
    await newFile.save();
    uploadedFiles.push(newFile);
  }

  const uploadedFilesResponse = uploadedFiles.map((file) => ({
    id: file._id.toString(),
    fileName: file.fileName,
    code: file.code,
    folder: file.folder,
    lifeSpan: file.lifeSpan,
    size: file.size,
    createdAt: file.createdAt,
    downloadUrl: file.downloadUrl,
  }));

  return res.status(200).json({
    success: true,
    message: "Files uploaded successfully",
    uploadedFilesResponse,
  });
};

// DONE: Complete get files
exports.getFile = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ success: false, message: "Code required" });
  }

  const existingFile = await File.find({ code });

  if (!existingFile || existingFile.length === 0) {
    return res.status(404).json({ success: false, message: "File not found" });
  }

  const uploadedFilesResponse = existingFile.map((file) => ({
    id: file._id.toString(),
    fileName: file.fileName,
    code: file.code,
    folder: file.folder,
    lifeSpan: file.lifeSpan,
    size: file.size,
    createdAt: file.createdAt,
    downloadUrl: file.downloadUrl,
  }));

  return res.status(200).json({ success: true, uploadedFilesResponse });
};

// DONE: Complete get folder
exports.getOwnerFolder = async (req, res) => {
  const code = req.session.folderCode;
  if (!code) {
    return res.status(400).json({ success: false, message: "Code requried" });
  }

  const existingFiles = await File.find({ folder: code });

  if (!existingFiles || existingFiles.length === 0) {
    return res.status(404).json({ success: false, message: "No files found" });
  }

  const uploadedFilesResponse = existingFiles.map((file) => ({
    id: file._id.toString(),
    fileName: file.fileName,
    code: file.code,
    folder: file.folder,
    lifeSpan: file.lifeSpan,
    size: file.size,
    createdAt: file.createdAt,
    downloadUrl: file.downloadUrl,
  }));

  return res.status(200).json({ success: true, uploadedFilesResponse });
};

exports.getFolder = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ success: false, message: "Code requried" });
  }

  const existingFiles = await File.find({ folder: code });

  if (!existingFiles || existingFiles.length === 0) {
    return res.status(404).json({ success: false, message: "No files found" });
  }

    const uploadedFilesResponse = existingFiles.map((file) => ({
    id: file._id.toString(),
    fileName: file.fileName,
    code: file.code,
    folder: file.folder,
    lifeSpan: file.lifeSpan,
    size: file.size,
    createdAt: file.createdAt,
    downloadUrl: file.downloadUrl,
  }));

  return res.status(200).json({ success: true, uploadedFilesResponse });
};

exports.downloadFile = async (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../files", fileName);

  console.log(fileName, filePath);
  

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: "Files not found" });
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
