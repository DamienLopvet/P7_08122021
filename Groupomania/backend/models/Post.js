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
    moderated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },
  {}
);

module.exports = Post;
