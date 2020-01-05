var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cookieSession = require("cookie-session");

///// TO BE OBSERVED /////
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var writerRouter = require("./routes/writer");
var postRouter = require("./routes/posts");
var adminRouter = require("./routes/admin");
var categoryRouter = require("./routes/category");
////// TO BE OBSERVED /////
var app = express();

//// Session SetUp ///

app.use(
  cookieSession({
    name: "session",
    keys: ["Reactnative@2018", "123"]
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

///// TO BE OBSERVED /////
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/writer", writerRouter);
app.use("/posts", postRouter);
app.use("/admin", adminRouter);
app.use("/category", categoryRouter);
///// TO BE OBSERVED /////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
