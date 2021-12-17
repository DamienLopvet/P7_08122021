const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

const loadModel = () => {
  User.hasMany(Post, {
    foreignKey: "userId",
    onDelete: "cascade",
  });
  Post.hasMany(Comment,{
    foreignKey:"postId",
    onDelete:"cascade",
  });
  User.sync();
  Post.sync();
  Comment.sync();
};
module.exports={loadModel, User, Post, Comment}