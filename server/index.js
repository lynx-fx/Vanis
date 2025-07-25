const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const sessionMiddleware = require("./middleware/session.js");
const generateCode = require("./utility/codeGenerator.js");
require('./jobs/cronsJobs.js');

const frontend =
  process.env.NODE_ENV == "production"
    ? process.env.FRONT_END_HOSTED
    : process.env.FRONT_END_LOCAL;

const app = express();
app.use(
  cors({
    origin: frontend,
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.log("Database connection error", err);
  });

app.get("/", (req, res) => {
  res.json({ message: "Hie ;)" });
});

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/getSession", (req, res) => {
  if (!req.session.folderCode) {
    req.session.folderCode = generateCode(8);
  }

  return res.status(200).json({
    success: true,
    message: "Session initiated",
    folderCode: req.session.folderCode,
  });
});

app.listen(process.env.PORT || 8000, () => {
  console.log(
    `Server running on port ${process.env.PORT} & serving to ${frontend}`
  );
});
