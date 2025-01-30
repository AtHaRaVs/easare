const cron = require("node-cron");
const cloudinary = require("cloudinary").v2;
const File = require("../models/file"); // Ensure correct model import

cron.schedule("0 0 * * *", async () => {
  console.log("Running cleanup job at midnight");

  try {
    const expiredFiles = await File.find({
      createdAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    for (const file of expiredFiles) {
      // Extract public ID correctly
      const match = file.url.match(/\/upload\/v\d+\/(.+)\.\w+$/);
      const publicId = match ? match[1] : null;

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
});
