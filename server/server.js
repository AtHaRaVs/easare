const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileRoutes");
const cloudinary = require("cloudinary").v2;

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://easare.vercel.app", // Frontend deployed on Vercel
  "https://easare-iz1b8bjde-atharavs-projects-a8c2660a.vercel.app", // Your other frontend URL
  // Add any additional allowed origins here
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow request
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow credentials (cookies, etc.)
  allowedHeaders: ["Content-Type", "Authorization", "x-upload-token"],
};

app.use(cors(corsOptions));

app.use(express.json());

require("./utils/node-cron");

app.use("/api/files", fileRoutes);

try {
  const expiredFiles = await File.find({});

  for (const file of expiredFiles) {
    // Extract public ID correctly
    const match = file.url;

    const getPublicId = (url) => {
      return url.replace(/^.*\/upload\/v\d+\//, "").replace(/\.[^.]+$/, "");
    };

    const publicId = getPublicId(match);

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted file from Cloudinary: ${file.filename}`);
    } else {
      console.log(`Failed to extract publicId for file: ${file.filename}`);
    }

    await File.deleteOne({ _id: file._id });
    console.log(`Deleted file record from database: ${file.filename}`);
  }
} catch (err) {
  console.error("Error in cleanup job:", err.message);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

connectDB();

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
