const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cryptoJs = require("crypto-js");


exports.signup = (req, res, next) => {
  //encrypting email
  emailCrypted = cryptoJs
    .HmacSHA256(req.body.email, process.env.DCRYPTMAIL)
    .toString();

  //hashing password
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        ...req.body,
        email: emailCrypted,
        password: hash
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Veuillez consulter votre boite mail afin de confirmer votre inscription" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
  emailCrypted = cryptoJs
    .HmacSHA256(req.body.email, process.env.DCRYPTMAIL)
    .toString();
  User.findOne({ email: emailCrypted })
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
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.TOKEN, {
              expiresIn: "1h",
              
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
