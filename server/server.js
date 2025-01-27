const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileRoutes");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://easare.vercel.app", // Allow this origin only
    credentials: true, // Allow cookies, authorization headers with requests
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());

require("./utils/node-cron");

app.use("/", fileRoutes);

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
