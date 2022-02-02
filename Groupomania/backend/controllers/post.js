const fs = require("fs");
const { Post, User, Comment } = require("../models/index");
const { Op } = require("sequelize");


//routes


/**
 * @swagger
 * /api/messages/send:
 *  post:
 *    security:
 *    - bearerAuth: []  
 *    summary: Envoyer un post dans la base de donnée
 *    consumes:
 *        - multipart/form-data
 *    produces:
 *      -  application/json
 *    parameters:
 *      - name: message
 *        in: formData
 *        type: string
 *      - name: attachmentUrl
 *        in: formData
 *        type: file
 *    responses:
 *      201:
 *        description: Post créé
 *        schema:
 *          type: object
 *          required:
 *          - message 
 *          - post
 *          properties:
 *            message:
 *              type: string
 *              default: post created!
 *            post:
 *              type: object
 *              required:
 *              - moderated
 *              - id
 *              - message
 *              - userId
 *              - updatedAt
 *              - createdAt
 *              properties:
 *                moderated:
 *                  type: boolean
 *                  default: false
 *                id:
 *                  type: integer
 *                message:
 *                  type: string
 *                userId:
 *                  type: integer
 *                updatedAt:
 *                  type: string
 *                  format: date-time
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *      400:
 *        description: Post introuvable ou mutlipartformData vide
 *      401:
 *        description: Operation non autorisée (token)
 *      500:
 *        description: Erreur Serveur    
 * 
 */
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

/**
 * @swagger
 * /api/messages:
 *  get:
 *    security:
 *    - bearerAuth: []  
 *    summary: Recupère l'ensemble des posts présents dans la base de données, associés aus profils utlisateurs et aux commentaires
 *    responses:
 *      200:
 *        description: Recevoir tous les posts avec profil utilisateur et commentaires
 *        schema:
 *          type: array
 *          items: 
 *            type: object
 *            required:
 *              - id
 *              - userId
 *              - message
 *              - attachmentUrl
 *              - moderated
 *              - createdAt
 *              - user
 *              - comments
 *            properties:
 *              id:
 *                type: integer
 *              userId:
 *                type: integer
 *              message:
 *                type: string
 *              attachementUrl:
 *                type: string
 *                format: uri
 *              moderated:
 *                type: boolean
 *                default: false
 *              createdAt:
 *                type: string
 *                format: date-time
 *              user:
 *                type: object
 *                required:
 *                - id
 *                - userName
 *                properties:
 *                  id:
 *                    type: integer
 *                  userName:
 *                    type: string
 *              comments:
 *                type: array
 *                items:
 *                  type: object
 *                  required:
 *                    - id 
 *                    - commentaire
 *                    - createdAt
 *                    - updatedAt
 *                    - userId
 *                    - postId
 *                    - user
 *                  properties:
 *                    id:
 *                      type: integer
 *                    commentaire:
 *                      type: string
 *                    createdAt:
 *                      type: string
 *                      format: date-time
 *                    updatedAt:
 *                      type: string
 *                      format: date-time
 *                    userId:
 *                      type: integer
 *                    postId:
 *                      type: integer
 *                    user:
 *                      type: object
 *                      required:
 *                      - id
 *                      - userName
 *                      properties:
 *                        id:
 *                          type: integer
 *                        userName:
 *                          type: string
 *      401:
 *        description: Operation non autorisée (token)
 *      500:
 *        description: Erreur serveur
 */
getAllPosts = (req, res, next) => {
  Post.findAll({
    order: [["id", "DESC"]],
    attributes: ["id", "userId", "message", "attachmentUrl","moderated", "createdAt"],
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

/**
 * @swagger
 * /api/messages/{userName}:
 *   get:
 *     security:
 *     - bearerAuth: []  
 *     summary: Recuperer tous les posts d'un utilisateur
 *     parameters:
 *     - in: path
 *       name: userName
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Reception de tous les posts avec profil utilisateur et commentaires
 *         schema:
 *           type: array
 *           items: 
 *             type: object
 *             required:
 *               - id
 *               - userId
 *               - message
 *               - attachmentUrl
 *               - moderated
 *               - createdAt
 *               - user
 *               - comments
 *             properties:
 *               id:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               message:
 *                 type: string
 *               attachementUrl:
 *                 type: string
 *                 format: uri
 *               moderated:
 *                 type: boolean
 *                 default: false
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               user:
 *                 type: object
 *                 required:
 *                 - id
 *                 - userName
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userName:
 *                     type: string
 *               comments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - id 
 *                     - commentaire
 *                     - createdAt
 *                     - updatedAt
 *                     - userId
 *                     - postId
 *                     - user
 *                   properties:
 *                     id:
 *                       type: integer
 *                     commentaire:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     userId:
 *                       type: integer
 *                     postId:
 *                       type: integer
 *                     user:
 *                       type: object
 *                       required:
 *                       - id
 *                       - userName
 *                       properties:
 *                         id:
 *                           type: integer
 *                         userName:
 *                           type: string
 *       400:
 *         description: Utilisateur inconnu
 *       401:
 *         description: Operation non autorisée (token)
 *       500:
 *         description: Erreur serveur
 */
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
        attributes: ["userId", "id", "message", "attachmentUrl","moderated", "createdAt"],
        where: { userId: user.id },
        include: [
          { model: User, attributes: ["id", "userName"] },
          {
            model: Comment,
            include: { model: User, attributes: ["id", "userName"] },
          },
        ],
      }).then((post) => res.status(200).json(post));
    })
    .catch((error) => {
      res.status(400).json({ message: "aucun utilisateur trouvé" });
    });
};

/**
 * @swagger
 * /api/messages/{messageId}:
 *  put: 
 *    security:
 *      - bearerAuth: []  
 *    summary: Modifier un post
 *    consumes:
 *        - multipart/form-data
 *    produces:
 *      -  application/json
 *    parameters:
 *    - in: path
 *      name: messageId
 *      required: true
 *      type: integer
 *    - name: message
 *      in: formData
 *      type: string
 *    - name: attachmentUrl
 *      in: formData
 *      type: file
 *    responses:
 *      201:
 *        description: Post créé
 *        schema:
 *          type: object
 *          required:
 *          - message 
 *          - post
 *          properties:
 *            message:
 *              type: string
 *            post:
 *              type: object
 *              required:
 *              - id
 *              - message
 *              - attachmentUrl
 *              - moderated
 *              - updatedAt
 *              - createdAt
 *              - userId
 *              properties:
 *                id:
 *                  type: integer
 *                message:
 *                  type: string
 *                  default: post modified!
 *                attachmentUrl:
 *                  type: string
 *                moderated:
 *                  type: boolean
 *                  default: false
 *                updatedAt:
 *                  type: string
 *                  format: date-time
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *                userId: 
 *                  type: integer
 *      400:
 *        description: Post introuvable ou mutlipartformData vide
 *      401:
 *        description: Autorisation refusée
 *      500:
 *        description: Erreur Serveur
 */
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
        post.attachmentUrl = null;
        message = req.body.message.trim();
        post.id = req.params.messageId;
        post.message = message;
        post.userId = post.userId;
        if(post.userId !== req.token.userId){
         post.moderated = true;   
        }

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

/**
 * @swagger
 * /api/messages/delete/{messageId}:    
 *  delete: 
 *    security:
 *      - bearerAuth: []  
 *    summary: Supprimer un post
 *    parameters:
 *    - in: path
 *      name: messageId
 *      required: true
 *      schema:
 *        type: integer
 *    responses:
 *      200: 
 *        description: Post supprimé
 *      400: 
 *        description: Post introuvable
 *      401:
 *        description: Operation non autorisée (token)
 */
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
