const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cryptoJs = require("crypto-js");
const password = require("../models/password");
const { Op } = require("sequelize");

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

signout = (req, res) => {};

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
        if(req.token.isAdmin && req.body.isAdmin === false){
          user.isAdmin=false
        } else if(req.token.isAdmin && req.body.isAdmin === true){
          user.isAdmin=true
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
  signout,
  getProfile,
  modifyProfile,
  deleteProfile,
};
