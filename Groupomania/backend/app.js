//import environment variables module
const express = require("express");
const app = express();
require("dotenv").config;
const { connexion } = require("./models/connexion");
const { loadModel } = require("./models/index");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

//give access to files path
const path = require("path");

//import http header security config
const helmet = require("helmet");

//import routers
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.1",
    info: {
      title: "Groupomania API",
      description: "Specification de l'API Groupomania",
      version: "1.0.0",
      contact: {
        name: "Damien",
      },
      servers: ["http://localhost:3030"],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          name: "Authorization",
          in: "header",
        },
      },
    },
  },
  apis: ["./controllers/*.js"],
};

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, { explorer: true })
);

module.exports = app;
