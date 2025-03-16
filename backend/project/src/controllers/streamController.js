const { streamVideoFile } = require("../services/videoService");

exports.streamVideo = (req, res, next) => {
  const { file } = req.params;
  console.log("Requested File:", file);

  streamVideoFile(file, req, res, next);
};
