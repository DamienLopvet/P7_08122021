//import environment variables module
require('dotenv').config
const {connexion} = require('./models/connexion')
const {loadModel} = require('./models/index')
const cors = require('cors')


const express = require("express");
const app = express();


//give access to files path
const path = require("path");

//import http header security config
const helmet = require("helmet");

//import routers
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");

connexion();
loadModel();
app.use(cors());
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
app.use("/attachments", express.static(path.join(__dirname, "attachments")));

//set up  with frontend root 
app.use("/api/messages", postRoutes);
app.use("/api/messages", commentRoutes);
app.use("/api/auth", userRoutes);



module.exports = app
