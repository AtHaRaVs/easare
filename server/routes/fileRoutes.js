const express = require("express");
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const File = require("../models/file");
const path = require("path");
const cookieParser = require("cookie-parser");

const router = express.Router();

// Ensure temp directory exists
const tempDir = path.join(__dirname, "temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Multer setup to temporarily store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir); // Save the file to 'temp/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Use a unique filename
  },
});

const upload = multer({ storage });

// Your upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "temp-files",
    });

    // Save file metadata in MongoDB
    const file = new File({
      filename: req.file.originalname,
      url: result.secure_url,
    });
    await file.save();

    // Remove the temporary file
    fs.unlinkSync(req.file.path);

    res.cookie("uploadStatus", "success", { httpOnly: true, path: "/" });
    console.log("Cookie set to success");

    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
