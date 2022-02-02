const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const password = require("../models/password");
const { Op } = require("sequelize");

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Ajouter un utilisateur à la base de donnée
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: body
 *       name: user
 *       description: Email de chez groupomania
 *       schema:
 *         type: object
 *         required:
 *         - email
 *         - userName
 *         - password
 *         properties:
 *           email:
 *             type: string
 *           userName:
 *             type: string
 *           password:
 *             type: string
 *     responses:
 *       201:
 *         description: user crée
 *         schema:
 *           type: object
 *           required:
 *           - userName
 *           - userId
 *           - isAdmin
 *           - token
 *           properties:
 *             userName:
 *               type: string
 *             userId:
 *               type: integer
 *             isAdmin:
 *               type: boolean
 *             token:
 *               type: string
 *       400:
 *         description: mauvaise requete, entrée non valide
 *       401:
 *         description: email ou userName déjà attribué
 *       500:
 *         description: Probleme avec le serveur
 */

signup = async (req, res, next) => {
  // check email white-space, validity and encrypting
  let email = req.body.email.trim();
  let user = await User.findOne({ where: { email: email } });
  if (user) {
    return res
      .status(401)
      .json({ message: "Désolé, cet Email est déja utlisé !" });
  } else {
    const emailregex = /^(.*)@(groupomania.org)$/;
    const emailIsvalid = emailregex.test(email);
    if (!emailIsvalid) {
      return res
        .status(400)
        .json({ message: "Un email Groupomania valide est requis" });
    } else {
      userName = req.body.userName.trim();

      if (userName.length > 20) {
        return res
          .status(400)
          .json({ message: "Le username doit contenir 20 caractères maximum" });
      } else {
        //check userName white-space and prevent injection
        user = await User.findOne({ where: { userName: userName } });
        if (user) {
          return res
            .status(401)
            .json({ message: "Désolé, ce userName est déja utlisé !" });
        } else {
          //hashing password
          bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
              const user = new User({
                userName: userName,
                email: email,
                //imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                password: hash,
              });
              user
                .save()
                .then((user) =>
                  res.status(201).json({
                    userName: user.userName,
                    userId: user.id,
                    isAdmin: user.isAdmin,
                    token: jwt.sign(
                      { userId: user.id, isAdmin: user.isAdmin },
                      process.env.TOKEN,
                      {
                        expiresIn: "48h",
                      }
                    ),
                  })
                )
                .catch((error) => {
                  res.status(400).json({ error });
                });
            })
            .catch((error) => {
              res.status(500).json({ error });
            });
        }
      }
    }
  }
};

/**
 * @swagger
 * /api/auth/signin:
 *  post:
 *    summary: logger un utilisateur
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: user
 *      description: Email de chez groupomania
 *      schema:
 *        type: object
 *        required:
 *        - email
 *        - password
 *        properties:
 *          email:
 *            type: string
 *          password:
 *            type: string
 *    responses:
 *      201:
 *        description: user crée
 *        schema:
 *          type: object
 *          required:
 *          - userName
 *          - userId
 *          - isAdmin
 *          - token
 *          properties:
 *            userName:
 *              type: string
 *            userId:
 *              type: integer
 *            isAdmin:
 *              type: boolean
 *            token:
 *              type: string
 *      401:
 *        description: Le mot de passe ne corespond pas, utilisateur non trouvé
 *      500:
 *        description: Probleme avec le serveur        
 */
signin = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: `Le mot de passe ne corespond pas.` });
          }
          res.status(200).json({
            userName: user.userName,
            userId: user.id,
            isAdmin: user.isAdmin,
            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              process.env.TOKEN,
              {
                expiresIn: "48h",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * @swagger
 * /api/auth/{userName}:
 *   get:
 *     security:
 *     - bearerAuth: []  
 *     summary: Trouver le profile d'un utilisateur
 *     parameters:
 *     - in: path
 *       name: userName
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         schema:
 *           type: object
 *           required:
 *           - userName
 *           - userId
 *           - isAdmin
 *           - email
 *           properties:
 *             userName:
 *               type: string
 *             userId:
 *               type: integer
 *             isAdmin:
 *               type: boolean
 *             email:
 *               type: string
 *       400:
 *         description: Mauvaise requete, entrée non valide
 *       401:
 *         description: email ou userName déjà attribué
 *       500:
 *         description: Probleme avec le serveur     
 *  
 */
getProfile = (req, res, next) => {
  User.findOne({
    where: { userName: { [Op.like]: req.params.userName + "%" } },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "Aucun utilisateur trouvé !" });
      }
      if (user.id == req.token.userId || req.token.isAdmin) {
        return res.status(200).json([
          {
            userName: user.userName,
            userId: user.id,
            isAdmin: user.isAdmin,
            email: user.email,
          },
        ]);
      } else {
        return res
          .status(401)
          .json({ message: "Oops, vous n'êtes pas autorisé à faire ça !" });
      }
    })
    .catch((error) => res.status(500).json(error));
};

/**
 * @swagger
 * /api/auth/{userName}/userModify:
 *   put:
 *     security:
 *     - bearerAuth: []  
 *     summary: Modifier le profile d'un utilisateur 
 *     consumes:
 *     - application/json
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: path
 *       name: userName
 *       required: true
 *       type: string
 *     - in: body
 *       name: user
 *       description: Email de chez groupomania
 *       schema:
 *         type: object
 *         required:
 *         - email
 *         - userName
 *         - password
 *         properties:
 *           email:
 *             type: string
 *           userName:
 *             type: string
 *           password:
 *             type: string
 *     responses:
 *       201:
 *         description: Utilisateur modifié
 *         schema:
 *           type: object
 *           required:
 *           - userName
 *           - userId
 *           - isAdmin
 *           - email
 *           properties:
 *             userName:
 *               type: string
 *             userId:
 *               type: integer
 *             isAdmin:
 *               type: boolean
 *             email:
 *               type: string
 *       400:
 *         description: Mauvaise requete, entrée non valide
 *       401:
 *         description: Email ou userName déjà attribué
 *       500:
 *         description: Probleme avec le serveur
 */
modifyProfile = (req, res, next) => {
  User.findOne({
    where: {
      userName: req.params.userName,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: "search error" });
      }
      if (user.id == req.token.userId || req.token.isAdmin) {
        //email checking
        if (req.body.email) {
          email = req.body.email.trim();
          const emailregex = /^(.*)@(groupomania.org)$/;
          const emailIsvalid = emailregex.test(email);
          if (!emailIsvalid) {
            return res
              .status(400)
              .json({ message: "Un email Groupomania valide est requis" });
          }
          user.email = email;
        }
        //check userName white-space
        if (req.body.userName) {
          userName = req.body.userName.trim();
          if (userName.length > 20) {
            return res.status(400).json({
              message: "Le username doit contenir 20 caractères maximum",
            });
          }
          user.userName = userName;
        }

        //hashing password
        if (req.body.password) {
          passwordChecked = password.validate(req.body.password);
          if (passwordChecked) {
            passwordHash = bcrypt
              .hash(req.body.password, 10)
              .then((hash) => {
                user.password = hash;
              })
              .catch((error) => res.status(400).json({ error }));
          } else {
            return res.status(400).json({
              message:
                "Le mot de passe devrait contenir entre 6 et 10 charactères, un symbole et au moins une majuscule, une minuscule et un chiffre.",
            });
          }
        }
        if (req.token.isAdmin && req.body.isAdmin === false) {
          user.isAdmin = false;
        } else if (req.token.isAdmin && req.body.isAdmin === true) {
          user.isAdmin = true;
        }

        user
          .save()
          .then(() =>
            res.status(201).json([
              {
                userName: user.userName,
                userId: user.id,
                isAdmin: user.isAdmin,
                email: user.email,
              },
            ])
          )
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

/**
 * @swagger
 * /api/auth/delete/{userId}:
 *  delete:
 *    security:
 *        - bearerAuth: []  
 *    summary: Supprimer un utilisateur
 *    parameters:
 *    - in: path
 *      name: userId
 *      required: true
 *      type: integer
 *    responses:
 *      201:
 *        description: Utilisateur effacé de la base de donnée
 *      400:
 *        description: Mauvaise requete, utilisateur non trouvé dans la base de donnée
 *      401:
 *        description: Operation non autorisée (token)
 *      500:
 *        description: Probleme avec le serveur
 *
 */
deleteProfile = (req, res) => {
  User.findOne({
    where: { id: req.params.userId },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: "search error" });
      }
      if (user.id == req.token.userId || req.token.isAdmin) {
        User.destroy({
          where: { id: user.id },
        }).then(() => res.status(200).json({ message: "User deleted" }));
      } else {
        return res
          .status(401)
          .json({ message: "Oops, vous n'êtes pas autorisé à faire ça !" });
      }
    })
    .catch((error) => res.status(500).json(error));
};

module.exports = {
  signup,
  signin,
  getProfile,
  modifyProfile,
  deleteProfile,
};
