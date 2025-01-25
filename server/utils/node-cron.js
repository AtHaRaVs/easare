const cron = require("node-cron");
const cloudinary = require("cloudinary");
const file = require("../models/file");

cron.schedule("0 0 * * * ", async () => {
  console.log("Running cleanup job at midnight");

  try {
    const expiredFiles = await file.find({
      createdAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    for (const file of expiredFiles) {
      const publicId = file.url.split("/").pop().split(".")[0];
      await cloudinary.uplaoder.destroy(`temp-files/${publicId}`);

      await file.deleteOne({ _id: file._id });
      console.log(
        `Deleted file: ${file.filename} from Cloudinary and database.`
      );
    }
  } catch (err) {
    console.log("Error in cleanup Job", err.message);
  }
});
