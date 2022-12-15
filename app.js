var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("./config/db.config");

//Router Definitions
var indexRouter = require("./routes/index.route");
var userRouter = require("./routes/user.route");
var stateRouter = require("./routes/state.route");
var parkRouter = require("./routes/park.route");

var app = express();

// console.log(process.env.PORT);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//CORS configuration
app.use(
  cors()
);

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/state", stateRouter);
app.use("/park", parkRouter);

module.exports = app;
