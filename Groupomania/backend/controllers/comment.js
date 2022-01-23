const Comment = require("../models/Comment");

createComment = (req, res, next) => {
  const commentaire = req.body.comment.trim();
  const comment = new Comment({
    userId: req.token.userId,
    postId: req.params.postId,
    commentaire,
  });
  if(!commentaire.length){
    return res.status(400).json({ message: "Le commentaire est vide" })  }
  comment
    .save()
    .then((comment) => res.status(201).json({ message: "Comment created!",
  comment: comment
  }))
    .catch((error) => res.status(400).json({ error }));
};

deleteComment = (req, res, next) => {
  Comment.findOne({
    where: { id: req.params.commentId },
  })
    .then((comment) => {
      if (!comment) {
       throw new Error ("comment not found!");
      }
      if (comment.userId == req.token.userId || req.token.isAdmin) {
        comment.destroy({
          where: { id: comment.id },
        });
      } else {
        return res.status(401).json({ error: "unauthorized" });
      }
    })
    .then(() => res.status(201).json({ message: "Comment deleted!" }))
    .catch((error) => res.status(400).json({ error }));
};
module.exports = { createComment, deleteComment }
