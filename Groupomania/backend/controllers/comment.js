const Comment = require("../models/Comment");
const User = require("../models/User");

createComment = (req, res, next) => {
  const commentaire = req.body.comment.trim();
  const comment = new Comment({
    userId: req.token.userId,
    postId: req.params.postId,
    commentaire,
  });
  comment
    .save()
    .then(() => res.status(201).json({ message: "Comment created!" }))
    .catch((error) => res.status(400).json({ error }));
};

deleteComment = (req, res, next) => {
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
      const isAdmin = user.isAdmin;

      Comment.findOne({
        attributes: ["id", "userId", "commentaire"],
        where: { id: req.params.commentId },
      })
        .then((comment) => {
          if (!comment) {
            res.status(400).json({ message: "comment not found!" });
          }

          if (comment.userId == bddUserId || isAdmin == true) {
            comment.destroy({
              where: { id: comment.id },
            });
          } else {
            return res.status(401).json({ error: "unauthorized" });
          }
        })
        .then(() => res.status(201).json({ message: "Comment deleted!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json(error));
};
module.exports = { createComment, deleteComment };
