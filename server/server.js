const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileRoutes");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // For local development
      "https://easare-84s5ykdm3-atharavs-projects-a8c2660a.vercel.app", // Your deployed frontend URL
    ],
    credentials: true,
  })
);

app.use(express.json());

require("./utils/node-cron");

app.use("/api/files", fileRoutes);

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
