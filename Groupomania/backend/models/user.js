const { db } = require("./connexion");
const { DataTypes } = require("sequelize");

const User = db.define(
  "user",
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    /*imageUrl: {
      type: DataTypes.STRING,
    },*/
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {}
);
module.exports = User;
