const express = require("express");
const path = require("path");
const upload = require("../middleware/multerConfig");

const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send({ message: "File uploaded successfully!", file: req.file });
});

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
