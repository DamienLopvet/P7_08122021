//import environment variables module
require("dotenv").config();

const express = require("express");
const app = express();
const mysql = require("mysql");

//give access to files path
const path = require("path");

//import http header security config
const helmet = require("helmet");



//create connection to mysql
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
});

const messageRoutes = require('./routes/message.js')
const comentRoutes = require('./routes/coment')
const userRoutes = require('./routes/user') 

//connection to mysql
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("mySQL Connected");
});

app.get("/test", (req, res) => {
  let sql = "CREATE TABLE testENV1(colonne_test INT NOT NULL) ";
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


//settings headers security config
app.use(helmet());

//parse request into json
app.use(express.json());


//static use of image datas
app.use("/images", express.static(path.join(__dirname, "images")));

//set up  with frontend root 
app.use("/api/messages", messageRoutes);
app.use("/api/coment", comentRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
