const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

exports.downloadAndSaveFile = async (url, filename) => {
  const filePath = path.join("./downloads", filename);

  const response = await axios({ url, method: "GET", responseType: "stream" });
  await fs.ensureDir("./downloads");
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
};
