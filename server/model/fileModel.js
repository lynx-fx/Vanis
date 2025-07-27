const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      required: true,
    },
    lifeSpan: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    downloadUrl: {
      type: String,
      required: true,
      default: "http://localhost:3000/upload"
    }
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;
