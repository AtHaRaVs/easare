const mongoose = require("mongoose"); // Ensure mongoose is imported
const File = require("../models/file");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Wrapping everything inside an async function
const seedDatabase = async () => {
  try {
    await connectDB();

    const newFile = new File({
      filename: "testfile.pdf",
      url: "https://example.com/testfile.pdf",
    });

    await newFile.save();
    console.log("File added and collection created");

    // Disconnect from the database after operation
    mongoose.disconnect();
  } catch (err) {
    console.error("Error adding file:", err);
    process.exit(1); // Exit process with failure
  }
};

// Call the async function
seedDatabase();
