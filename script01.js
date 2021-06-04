const File = require("./models/file.js");
const fs = require("fs");
const connectDB = require("./config/db");

connectDB();

async function fetchData() {
  // 24 hours old file fetch

  const pastDate = new Date(Date.now() - 60 * 60 * 24 * 1000);
  const files = await File.find({ createdAt: { $lt: pastDate } });

  if (files.length) {
    for (const file of files) {
      try {
        fs.unlinkSync(file.path);

        await file.remove();

        console.log(`successfully deleted ${file.filename}`);
      } catch (err) {
        console.log(` Error while deleting file ${file}`);
      }
    }
    console.log('job done');
  }
}


fetchData().then( process.exit );
   
   
