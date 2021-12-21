const fs = require("fs");
const { Post, User, Comment } = require("../models/index");

createPost = (req, res, next) => {
  let message = req.body.message.trim();

  let post = new Post({
    message,
    userId: req.token.userId,
  });
  if (req.file) {
    post.attachmentUrl = `${req.protocol}://${req.get("host")}/attachments/${
      req.file.filename
    }`;
  }
  if (!message.length && !post.attachmentUrl) {
    return res.status(400).json({ message: "post cannot be empty!" });
  }
  post
    .save()
    .then(() => res.status(201).json({ message: "Post created!" }))
    .catch((error) => res.status(400).json({ error }));
};

getAllPosts = (req, res, next) => {
  Post.findAll({
    attributes: ["userId", "message", "attachmentUrl", "createdAt"],
    include: [User, { model: Comment, include: User }],
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

modifyPost = (req, res, next) => {
  Post.findOne({
    where: {
      id: req.params.messageId,
    },
  })
    .then((post) => { 

      if (!post) {
        return res.status(400).json({ message: "post not found" });
      }
      if (post.userId == req.token.userId || req.token.isAdmin) {
        message = req.body.message.trim();
        post.id = req.params.messageId;
        post.message = message;
        post.userId = req.token.userId;
        console.log('post')
        
        if (req.file) {
    post.attachmentUrl = `${req.protocol}://${req.get("host")}/attachments/${
      req.file.filename
    }`;
  }

        if (!message.length && !post.attachmentUrl) {
          return res.status(400).json({ message: "post cannot be empty!" });
        }
        post
          .save()
          .then(() => res.status(201).json({ message: "Post modified!" }))
          .catch((error) => res.status(500).json(error));
      }
    })
    .catch((error) => res.status(500).json(error));
};

deletePost = (req, res, next) => {
  Post.findOne({
    where: {
      id: req.params.messageId,
    },
  })
    .then((post) => {
      if (!post) {
        return res.status(400).json({ message: "post not found" });
      }
      if (post.userId == req.token.userId || req.token.isAdmin) {
        const filename = post.attachmentUrl.split("/attachments/")[1];
        fs.rm(`attachments/${filename}`, () => {
          Post.destroy({
            where: { id: post.id },
          })
            .then(() => res.status(200).json({ message: "post deleted" }))
            .catch((error) => res.status(400).json({ error }));
        });
      } else {
        return res.status(401).json({ error: "unauthorized" });
      }
    })
    .catch((error) => res.status(500).json(error));
};
module.exports = {
  createPost,
  modifyPost,
  deletePost,
  getAllPosts,
  getUserPosts,
};
