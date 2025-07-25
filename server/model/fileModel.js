const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileUri: {
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
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);
module.exports = File;
