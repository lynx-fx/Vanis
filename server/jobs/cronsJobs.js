const File = require("../model/fileModel.js");
const cron = require('node-cron');

cron.schedule('0 */1 * * *', async () => {
  try {
    const now = new Date();
    const expiredFiles = await File.find({
      $expr: {
        $lt: [
          { $add: ['$createdAt', { $multiply: ['$lifeSpan', 3600000] }] },
          now,
        ],
      },
    });

    for (const file of expiredFiles) {
      // TODO: Delete the actual files from server as well
      await File.findByIdAndDelete(file._id);
      console.log(`Deleted expired file: ${file._id}`);
    }
  } catch (err) {
    console.error('Error deleting expired files:', err);
  }
});