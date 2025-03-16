const express = require("express");
const router = express.Router();
const { streamVideo } = require("../controllers/streamController");

router.get("/:file", streamVideo);

module.exports = router;
