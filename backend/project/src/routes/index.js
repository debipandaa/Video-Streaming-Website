const express = require("express");
const router = express.Router();

router.use("/search", require("./searchRoutes"));
router.use("/stream", require("./streamRoutes"));
router.use("/download", require("./downloadRoutes"));

module.exports = router;
