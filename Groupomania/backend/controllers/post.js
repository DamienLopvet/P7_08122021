const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");
const { post } = require("../routes/post");

createPost = (req, res, next) => {
  const message = req.body.post;
  const postObject = req.file
    ? {
        attachmentUrl: `${req.protocol}://${req.get("host")}/attachments/${
          req.file.filename
        }`,
      }
    : {};

  const post = new Post({
    ...postObject,
    message,
    userId: req.token.userId,
  });
  if (post.message == null && post.attachmentUrl == null) {
    res.status(400).json({ message: "post cannot be empty!" });
  }
  post
    .save()
    .then(() => res.status(201).json({ message: "Post created!" }))
    .catch((error) => res.status(400).json({ error }));
};

getAllPosts = (req, res, next) => {
  Post.findAll({
    attributes: ["userId", "message", "attachmentUrl", "createdAt"],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(500).json(error));
};

getUserPosts = (req, res, next) => {
  Post.findAll({
    attributes: ["userId", "message", "attachmentUrl", "createdAt"],
    where: { userId: req.params.userId },
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(500).json(error));
};

deletePost = (req, res, next) => {
  User.findOne({
    attributes: ["id", "isAdmin"],
    where: {
      id: req.token.userId,
    },
  })
    .then((user) => {
      // peut être pas tres utile !! ca serait étonnant qu'on ne trouve pas un user si l'id est present dans le token
      if (!user) {
        return res.status(400).json({ error: "search error" });
      }
      const bddUserId = user.id;
      const bddUserAdmin = user.isAdmin;

      Post.findOne({
        attributes: ["id", "userId", "attachmentUrl","message"],
        where: {
          id: req.params.messageId,
        },
      })
        .then((post) => {
          console.log('tokenId:'+bddUserId);
          console.log('isAdmin:'+ bddUserAdmin);
          console.log("postUserId:" + post.userId);
          if (!post) {
            return res.status(400).json({ message: "post not found" });
          }
          if (post.userId == req.token.userId || bddUserAdmin == true) {
            const filename = post.attachmentUrl.split("/attachments/")[1];
        fs.rm(`attachments/${filename}`,()=>{
            Post.destroy({
              where: { id: post.id },
            }).then(() => res.status(200).json({ message: "post deleted" }))
            .catch((error) => res.status(400).json({ error }));
          });
          }else{
          return res.status(401).json({ error: "unauthorized" });
       } })
       .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};
module.exports = { createPost, deletePost, getAllPosts, getUserPosts };
