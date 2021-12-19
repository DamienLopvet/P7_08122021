require("dotenv").config();
const nodemailer = require("nodemailer");

transporter = nodemailer.createTransport({
  port: process.env.SMPTPORT,
  host: process.env.SMPTPATH,
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASSWORD,
  },
  secure: true,
});
//exports.signupConfirmation = {
//    from: process.env.EMAILSENDER, // sender address
//    to: req.body.email, // list of receivers
//    subject: "Votre compte Groupomania Social-Network",
//    text:`Bonjour ${req.body.prenom},<br/> Pour finaliser la création de votre compte Groupomania Social-Network, validez votre adresse email en cliquant sur ce lien :<br/> <a href= "http://localhost:3000/api/auth/login?token= ${jswtoken.verifyEmail}"/>.
//    `
//}
apiOverRequested = {
  from: process.env.EMAILSENDER, // sender address
  to: process.env.EMAILRECEIVER, // list of receivers
  subject: "there are two many request beeing sended on your website",
  text: "50 request have been made in one quarter of an hour, it's weird, you will have to check your logs to findout what happend it seem that you are beeing under attack !! Best regards . Webdeveloper ",
};
userLogOverRequested = {
  from: process.env.EMAILSENDER, // sender address
  to: process.env.EMAILRECEIVER, // list of receivers
  subject: "there are two many login request beeing sended on your website",
  text: "5 request have been made in one hour, it's weird, you will have to check your logs to findout what happend it seem that you are beeing under attack !! Best regards . Webdeveloper ",
};

//mail = transporter.sendMail({
//  from : process.env.EMAILSENDER,
//  to: "damienlopvet@gmail.com",
//  subject:"test",
//  text:"texte.test"
// } );

 module.exports= {transporter, apiOverRequested, userLogOverRequested}