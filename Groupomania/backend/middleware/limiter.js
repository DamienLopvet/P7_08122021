require("dotenv").config();
const mailer = require("../models/mailer");
const rateLimiter = require("express-rate-limit");

userLogLimiter = new rateLimiter({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 25, // limit each IP to 5 requests per windowMs
  message:
  {message :"Vous avez essayé de vous connecter un trop grand nombre de fois, veuillez attendre 1 heures pour tenter un nouvel essai."},

  //  onLimitReached: () => {
  //mailer.transporter.sendMail(mailer.userLogOverRequested)  },
});

apiLimiter = new rateLimiter({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 1000,
  message: {message :"Un trafic reseau anormal a été detecté, veuillez attendre une heure pour vous connecter de nouveau"},

  //onLimitReached: () => {
  //  mailer.transporter.sendMail(mailer.apiOverRequested)
  //    },
});

module.exports = { apiLimiter, userLogLimiter };
