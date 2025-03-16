const { downloadAndSaveFile } = require("../services/fileService");

exports.downloadFile = async (req, res, next) => {
  const { url, filename } = req.body;
  try {
    const filePath = await downloadAndSaveFile(url, filename);
    res.json({ message: "File downloaded", path: filePath });
  } catch (error) {
    next(error);
  }
};
