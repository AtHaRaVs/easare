const express = require("express");
const cloudinary = require("cloudinary");
const file = require("../models/file");
const multer = require("multer");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.UploadStream.UploadStream(
        {
          resource_type: "auto",
          folder: "temp-files",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const file = new file({
      filename: req.file.originalname,
      url: result.secure_url,
    });

    await file.save();

    res.json({ message: "File uploaded successfully", file });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
