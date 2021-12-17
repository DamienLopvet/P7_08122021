const { db } = require("./connexion");
const { DataTypes } = require("sequelize");

const Comment = db.define(
    "comment",
    {
      userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId:{
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      commentaire: {
        type: DataTypes.STRING,
        allowNull: false,
    }
      
    },
    {}
  );
  
  module.exports = Comment;