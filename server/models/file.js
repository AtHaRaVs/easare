const mongoose = require("mongoose");

// Check if the model is already defined, otherwise define it
const File =
  mongoose.models.File ||
  mongoose.model(
    "File",
    new mongoose.Schema({
      filename: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400, // Expires after 24 hours
      },
    })
  );

module.exports = File;
