const { db } = require("./connexion");
const { DataTypes } = require("sequelize");

const Comment = db.define(
    "comment",
    {
     commentaire: {
        type: DataTypes.STRING,
        allowNull: false,
    }
      
    },
    {}
  );
  
  module.exports = Comment;