const express = require("express");
const app = express();
const mysql = require("mysql");

//give access to files path
const path = require("path");

//import http header security config
const helmet = require("helmet");

//import environment variables module
require("dotenv").config();

//create connection to mysql
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "foodly",
});

//connection to mysql
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mySQL Connected");
});

app.get("/foodly", (req, res) => {
  let sql = "USE foodly";
  db.query(sql, (err) => {
    if (err) {
      throw err;
    }
    res.send("database set to foodly");
  });
});
app.get("/foodly/users", (req, res) => {
  let sql = "SELECT * FROM utilisateur";
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    
    res.send(results);
    console.log(results);
  });
});

//static use of image datas
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//    app.use('api/', XXXroutes);

//parse request into json
app.use(express.json());

//settings headers security config
app.use(helmet());

module.exports = app;
