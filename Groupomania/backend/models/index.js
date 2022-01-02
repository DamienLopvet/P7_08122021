const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

const loadModel = () => {
  Post.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "cascade",
  });
  Comment.belongsTo(User, {
    foreignKey: "userId",
    onDelete: "cascade"
    
  })
  Post.hasMany(Comment,{
    foreignKey:"postId",
    onDelete:"cascade",
    });
    
  User.sync();
  Post.sync();
  Comment.sync();
};
module.exports={loadModel, User, Post, Comment}