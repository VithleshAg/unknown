var express = require("express");
var router = express.Router();
var Pool = require("pg-pool");
var db_config = require("../database");
var pool = new Pool(db_config);

router.all("*", function(req, res, next) {
  if (req.session.writer === undefined) {
    res.redirect("/writer/register");
  } else {
    next();
  }
});

router.get("/create", function(req, res, next) {
  res.render("post/create", { writer: req.session.writer });
});

router.get("/all_rest", function(req, res) {
  let writer_id = req.session.writer._id;

  let query = `select * from post where writer_id = '${writer_id}'`;
  pool.query(query, function(err, result) {
    if (err) throw err;
    ///////////// DATA PROCESSING ////////////
    let sendData = [];
    let data = result.rows;
    let temp_index = 0;
    let temp_array = [];
    for (let i = 0; i < data.length; i++) {
      if (temp_index === 0) {
        temp_array = [];
        temp_array.push(data[i]);
        temp_index++;
      } else {
        temp_array.push(data[i]);
        temp_index++;
        if (temp_index === 2) {
          sendData.push(temp_array);
          temp_index = 0;
        }
      }
      if (i === data.length - 1 && data.length % 2 !== 0) {
        sendData.push(temp_array);
      }
    }
    //////// DATA PROCESSING /////////////////
    res.json(sendData);
  });
});

router.get("/all", function(req, res) {
  res.render("post/all", { writer: req.session.writer });
});

router.post("/submit", function(req, res) {
  let { title, content } = req.body;
  let writer_id = req.session.writer._id;
  let post_categories = req.body.categories;
  let date = new Date();
  date =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

  let time = new Date();
  time = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
  let query = `insert into post(title,content,date,time,writer_id) values('${title}','${content}','${date}','${time}','${writer_id}') returning _id`;
  pool.query(query, function(err, result) {
    if (err) throw err;
    let post_id = result.rows[0]._id;
    let dynvalues = `insert into post_categories(post_id,category_id) values`;
    for (let i = 0; i < post_categories.length; i++) {
      dynvalues += `('${post_id}','${post_categories[i]}'),`;
    }
    dynvalues = dynvalues.substr(0, dynvalues.length - 1);
    pool.query(dynvalues, function(err, result) {
      if (err) throw err;
      res.redirect("/posts/all");
    });
  });
});

router.get("/getById/:post_id", function(req, res) {
  let post_id = req.params.post_id;
  // let query = `select p.*  , ( select t.* from post_categories t where t.post_id = p._id::text)  from post p  where _id = '${post_id}'`;
  let query = `select *   from post   where _id = '${post_id}'`;
  console.log(query);
  pool.query(query, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ code: "failed", data: {} });
    } else {
      res.status(200).json({ code: "success", post: result.rows[0] });
    }
  });
});

router.post("/delete", function(req, res) {
  let post_id = req.body.post_id;
  let query = `delete from post where _id = '${post_id}'`;
  pool.query(query, function(err, result) {
    if (err) throw err;
    res.status(200).json({ message: "deleted" });
  });
});

router.get("/demo_AJAX", function(req, res) {
  res.render("demo_AJAX");
});

module.exports = router;
