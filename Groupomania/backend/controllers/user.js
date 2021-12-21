const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cryptoJs = require("crypto-js");
const fs = require("fs");

signup = (req, res, next) => {
  // check email white-space, validity and encrypting
  email = req.body.email.trim();
  const emailregex =/^(.*)@(.*)$/
  const emailIsvalid = emailregex.test(email);
  if (email && emailIsvalid) {
    emailCrypted = cryptoJs
      .HmacSHA256(email, process.env.DCRYPTMAIL)
      .toString();
  } else {
    return res.status(400).json({ message: "A valid email is required" });
  }

  //check userName white-space and prevent injection
  name = req.body.userName.trim();
  if (name.length > 20) {
    return res.status(400).json({ message: "UserName must be shorter (max 20 characters)" });
  }
  //hashing password
  passwordHash = bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        userName : name,
        email: emailCrypted,
        //imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        password: hash,
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
            isAdmin: user.isAdmin,
            token: jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.TOKEN, {
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

modifyProfile = (req, res, next)=>{
User.findOne({
  where:{
    id: req.params.userId
  }
  
}).then((user)=>{
if (!user) {
        res.status(400).json({ error: "search error" });
      }
      if (user.id == req.token.userId || req.token.isAdmin) {
     
     //email checking
      email = req.body.email.trim();
  const emailregex =/^(.*)@(.*)$/
  const emailIsvalid = emailregex.test(email);
  if (email && emailIsvalid) {
    emailCrypted = cryptoJs
      .HmacSHA256(email, process.env.DCRYPTMAIL)
      .toString();
  } else {
    return res.status(400).json({ message: "A valid email is required" });
  }

  //check userName white-space 
  name = req.body.userName.trim();
  if (name.length > 20) {
    return res.status(400).json({ message: "UserName must be shorter (max 20 characters)" });
  }

  //hashing password
  passwordToHash = bcrypt
    .hash(req.body.password, 10).then(hash=>{
      passwordHash = hash
    }).catch((error) => res.status(400).json({ error }));;

        user.id = req.token.userId
        user.userName = name,
        user.email= emailCrypted,
        user.password = passwordHash
        //imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      
      user
        .save()
        .then(() => res.status(201).json({ message: "user created!" }))
        .catch((error) => res.status(400).json({ error }));
}

}).catch((error) => res.status(400).json({ error }));
}



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

module.exports = { signup, signin, signout, getProfile, modifyProfile, deleteProfile };
