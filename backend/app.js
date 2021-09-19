const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const enforce = require("express-sslify");
const mongoose = require("mongoose");

// Create express app
const app = express();

// Set up development environment
if (
  process.env.NODE_ENV !== "production"
) {
  console.log("Running in development mode");
  require("dotenv").config();
  app.use(require("morgan")("dev"));
} else {
  console.log("Running in production mode");
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// Define routers
const apiRouter = require("./routes/api");

// Configure MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up app
// Use JSON parser for all non-webhook routes
app.use((req, res, next) => {
  bodyParser.json()(req, res, next);
});
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "dist")));

// Set up routers
app.use("/api", apiRouter);

module.exports = app;
