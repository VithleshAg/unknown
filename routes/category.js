var express = require("express");
var router = express.Router();

var Pool = require("pg-pool");
var db_config = require("../database");
var pool = new Pool(db_config);

router.get("/register", function(req, res) {
  res.render("category/register", { message: "" });
});

router.post("/submit", function(req, res) {
  let { catName } = req.body;
  let query = `insert into category(catName) values('${catName}')`;
  pool.query(query, function(err, result) {
    if (err) throw err;
    res.redirect("/category/all");
  });
});

router.get("/all", function(req, res) {
  let query = `select * from category`;
  pool.query(query, function(err, result) {
    if (err) throw err;
    res.render("category/all", { data: result.rows });
  });
});

router.get("/all_rest", function(req, res) {
  pool.query("select * from category", function(err, result) {
    if (err) throw err;
    res.json(result.rows);
  });
});

module.exports = router;
