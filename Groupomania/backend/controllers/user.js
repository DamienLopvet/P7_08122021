const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cryptoJs = require("crypto-js");
const fs = require("fs");

signup = (req, res, next) => {
  // check email white-space, validity and encrypting 
  email = req.body.email.trim();
  const emailregex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const emailIsvalid = emailregex.test(email);
  if (emailIsvalid) {
    emailCrypted = cryptoJs
      .HmacSHA256(email, process.env.DCRYPTMAIL)
      .toString();
  } else {
    return res.status(400).json({ message: "Invalid email" });
  }

//check userName white-space and prevent injection
Name= req.body.userName.trim()
const userNameregex = /^(?=[a-zA-Z0-9._-]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
const userNameIsValid = userNameregex.test(Name)
if(userNameIsValid){
userName = Name
}else{
  return res.status(400).json({ message: "Invalid UserName" })
}
  //hashing password
  passwordHash = bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
       userName,
        email: emailCrypted,
        //imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        password: hash,
        isAdmin: false,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "user created!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

signin = (req, res, next) => {
  emailCrypted = cryptoJs
    .HmacSHA256(req.body.email, process.env.DCRYPTMAIL)
    .toString();
  User.findOne({ where: { email: emailCrypted } })
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
            userId: user.id,
            token: jwt.sign({ userId: user.id }, process.env.TOKEN, {
              expiresIn: "48h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

signout = (req, res) => {};

getProfile = (req, res, next) => {
  User.findOne({
    attributes: ["email", "username"],
    where: { id: req.token.userId },
  })
    .then((user) => {
      if (!user) {
        res.status(400).json({ error: "search error" });
      }
      res.status(200).json(user);
    })
    .catch((error) => res.status(500).json(error));
};

deleteProfile = (req, res) => {
  User.destroy({
    where: { id: req.token.userId },
  })
    .then((user) => {
      if (!user) {
        res.status(400).json({ error: "search error" });
      }
      res.status(200).json({ message: "user deleted" });
    })
    .catch((error) => res.status(500).json(error));
};

module.exports = { signup, signin, signout, getProfile, deleteProfile };
