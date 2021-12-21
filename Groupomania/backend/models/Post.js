const { db } = require("./connexion");
const { DataTypes } = require("sequelize");

const Post = db.define(
  "post",
  {
    message: {
      type: DataTypes.STRING,
    },
    attachmentUrl: {
      type: DataTypes.STRING,
    },
  },
  {}
);

module.exports = Post;
