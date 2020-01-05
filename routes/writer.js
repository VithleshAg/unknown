var express = require("express");
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: "public/images/" });

var Pool = require("pg-pool");
var db_config = require("../database");
var pool = new Pool(db_config);

router.get("/register", function(req, res) {
  res.render("writer/register", { message: "" });
});

router.post("/submit", upload.single("pic"), function(req, res) {
  let pic = req.file.filename;
  const { name, email, password } = req.body;

  let query = `insert into writer(name,email,password,pic) values('${name}','${email}','${password}','${pic}')`;

  pool.query(query, function(err, result) {
    if (err) throw err;
    res.send("<h3>You Are Succesfully Registered...</h3>");
  });
});

router.post("/checkLogin", function(req, res) {
  let { email, password } = req.body;
  let query = `select * from writer where email = '${email}' and password = '${password}'`;
  pool.query(query, function(err, result) {
    if (result.rows.length == 0) {
      res.render("writer/register", { message: "Invalid Credientials...." });
    } else {
      req.session.writer = result.rows[0];
      res.redirect("/writer/dashboard");
    }
  });
});

router.get("/all", function(req, res) {
  let query = `select * from writer`;
  pool.query(query, function(err, result) {
    if (err) throw err;
    res.render("writer/all", { data: result.rows });
  });
});

router.all("*", function(req, res, next) {
  if (req.session.writer === undefined) {
    res.redirect("/writer/register");
  } else {
    next();
  }
});

router.get("/dashboard", function(req, res) {
  res.render("writer/dashboard", { writer: req.session.writer });
});

router.get("/delete/:id", function(req, res) {
  let id = req.params.id;
  let query = `delete from writer where _id = ${id} `;
  pool.query(query, function(err, result) {
    if (err) throw err;
    res.redirect("/writer/all");
  });
});

router.get("/update/:id", function(req, res) {
  let id = req.params.id;
  let query = `select * from writer where _id = ${id}`;
  pool.query(query, function(err, result) {
    res.render("writer/update", { data: result.rows[0] });
  });
});

router.post("/update_submit", function(req, res) {
  const { name, email, password, id } = req.body;
  let query = `update writer set name = '${name}' , email = '${email}' , password = '${password}' where _id = ${parseInt(
    id
  )}`;
  pool.query(query, function(err, result) {
    if (err) throw err;
    res.redirect("/writer/all");
  });
});

router.post("/update_image", upload.single("pic"), function(req, res) {
  let id = req.body.id;
  let file = req.file.filename;
  let query = `update writer set  pic = '${file}' where _id = ${parseInt(id)} `;
  pool.query(query, function(err, result) {
    if (err) throw err;
    res.redirect("/writer/all");
  });
});

router.get("/logout", function(req, res) {
  if (!(req.session.writer === undefined)) {
    req.session.writer = undefined;
    res.redirect("/writer/register");
  } else {
    res.redirect("/writer/register");
  }
});

///////////// REST API   //////////////
router.get("/all_rest", function(req, res) {
  let query = `select * from writer`;
  pool.query(query, function(err, result) {
    //res.send("hello Vithlesh...");
    res.json(result.rows);
  });
});
///////////  REST API  ////////////////

module.exports = router;
