var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("./config/db.config");

//Router Definitions
var indexRouter = require("./routes/index");
var userRouter = require("./routes/auth");

var app = express();

// console.log(process.env.PORT);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//CORS configuration
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
  })
);

app.use("/user", userRouter);
app.use("/", indexRouter);

module.exports = app;
