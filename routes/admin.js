var express = require("express");
var router = express.Router();

var Pool = require("pg-pool");
var db_config = require("../database");
var pool = new Pool(db_config);

router.get("/dashboard", function(req, res) {
  res.render("admin/dashboard");
});

router.get("/login", function(req, res) {
  res.render("admin/login", { message: "" });
});

router.post("/checkLogin", function(req, res) {
  // let query = `create table admin(_adminId serial primary key, email text, password text)`;
  // let query = `select * from admin`;
  let { email, password } = req.body;
  let query = `select * from admin where email = '${email}' and password = '${password}'`;
  pool.query(query, function(err, result) {
    if (result.rows.length == 0) {
      res.render("admin/login", { message: "Invalid Credientials...." });
    } else {
      res.redirect("/admin/dashboard");
    }
  });
});

module.exports = router;
