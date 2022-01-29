const fs = require("fs");
const { Post, User, Comment } = require("../models/index");
const { Op } = require("sequelize");

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
    return res.status(400).json({ message: "Votre post est vide !" });
  }
  post
    .save()
    .then((post) =>
      res.status(201).json({ message: "Post created!", post: post })
    )
    .catch((error) => res.status(400).json({ error }));
};

getAllPosts = (req, res, next) => {
  Post.findAll({
    order: [["id", "DESC"]],
    attributes: ["id", "userId", "message", "attachmentUrl", "createdAt"],
    include: [
      { model: User, attributes: ["id", "userName"] },
      {
        model: Comment,
       include: { model: User, attributes: ["id", "userName"] },
      },
    ],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(500).json(error));
};

getUserPosts = (req, res, next) => {
  User.findOne({
    where: { userName: { [Op.like]: req.params.userName + "%" } },
  })
    .then((user) => {
      if (!user) {
        throw new Error("hey");
      } else return user;
    })
    .then((user) => {
      console.log(user);
      Post.findAll({
        order: [["id", "DESC"]],
        attributes: ["userId", "id", "message", "attachmentUrl", "createdAt"],
        where: { userId: user.id },
        include: [User, { model: Comment, include: User }],
      }).then((post) => res.status(200).json(post));
    })
    .catch((error) => {
      res.status(400).json({ message: "aucun utilisateur trouvé" });
    });
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
        post.attachmentUrl=null
        message = req.body.message.trim();
        post.id = req.params.messageId;
        post.message = message;
        post.userId = req.token.userId;

        if (req.file) {
          post.attachmentUrl = `${req.protocol}://${req.get(
            "host"
          )}/attachments/${req.file.filename}`;
        }

        if (!message.length && !post.attachmentUrl) {
          return res.status(400).json({ message: "Votre post est vide!" });
        }
        post
          .save()
          .then((post) =>
            res.status(201).json({ message: "Post modified!", post: post })
          )
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
        if (post.attachmentUrl) {
          const filename = post.attachmentUrl.split("/attachments/")[1];
          fs.rm(`attachments/${filename}`, () => {
            Post.destroy({
              where: { id: post.id },
            })
              .then(() => res.status(200).json({ message: "post deleted" }))
              .catch((error) => res.status(400).json({ error }));
          });
        } else {
          Post.destroy({
            where: { id: post.id },
          })
            .then(() => res.status(200).json({ message: "post deleted" }))
            .catch((error) => res.status(400).json({ error }));
        }
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
