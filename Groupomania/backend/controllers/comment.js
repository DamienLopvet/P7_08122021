const Comment = require("../models/Comment");

/**
 * @swagger
 * /api/messages/{postId}/comment:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: Envoyer un commentaire dans la base de donnée
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: path
 *      name: postId
 *      required: true
 *      type: integer
 *    - in: body
 *      name: commentaire
 *      schema:
 *        type: object
 *        required:
 *        - comment
 *        properties:
 *          comment:
 *            type: string
 *    responses:
 *      201:
 *        description: Commentaire créé
 *        schema:
 *          type: object
 *          required:
 *          - message
 *          properties:
 *            message:
 *              type: string
 *              default: Comment created!
 *      400:
 *        description: Le commentaire est vide
 *      401:
 *        description: Operation non autorisée (token)
 */
createComment = (req, res, next) => {
  const commentaire = req.body.comment.trim();
  const comment = new Comment({
    userId: req.token.userId,
    postId: req.params.postId,
    commentaire,
  });
  if (!commentaire.length) {
    return res.status(400).json({ message: "Le commentaire est vide" });
  }
  comment
    .save()
    .then((comment) =>
      res.status(201).json({ message: "Comment created!", comment: comment })
    )
    .catch((error) => res.status(400).json({ error }));
};

/**
 * @swagger
 * /api/messages/comment/{commentId}:
 *  delete:
 *    security:
 *    - bearerAuth: []
 *    summary: Supprimer un commentaire
 *    parameters:
 *    - in: path
 *      name: commentId
 *      required: true
 *      type: integer
 *    responses:
 *      200:
 *        description: Commentaire supprimé
 *      400:
 *        description: commentaire introuvable
 *      401:
 *        description: Operation non autorisée (token)
 */
deleteComment = (req, res, next) => {
  Comment.findOne({
    where: { id: req.params.commentId },
  })
    .then((comment) => {
      if (!comment) {
        throw new Error("comment not found!");
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
module.exports = { createComment, deleteComment };
