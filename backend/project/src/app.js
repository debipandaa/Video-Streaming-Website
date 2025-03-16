const express = require("express");
const app = express();
const morgan = require("morgan");
const errorMiddleware = require("./middlewares/errorMiddleware");

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", require("./routes"));

// Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
