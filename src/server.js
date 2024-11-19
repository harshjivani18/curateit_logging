// local environment variable
require("dotenv").config();

// Express app and port setup
const express     = require("express");
const bodyParser  = require("body-parser");
const cors        = require("cors");

// Request Logs import
// const reqLogs     = require("./middlewares/requestlogs.middleware")

// Creating App
const app         = express();

// Requesting for database access
require("../config/db");

// Setting up json response and added urlencoded
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cors());
// app.use(reqLogs)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routes
require("./routes/index")(app);

// Setting up inital routes
app.get("/", (req, res) => {
  return res.status(200).send("<h4>Welcome to Curateit Logging System</h4>");
});

// Exporting app
module.exports = app;