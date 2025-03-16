const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
  filename: String,
  url: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Download", downloadSchema);
