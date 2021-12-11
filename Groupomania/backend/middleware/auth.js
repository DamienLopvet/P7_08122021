const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    //catch the token in the header 
    const token = req.headers.authorization.split(" ")[1];

    //check token validity and set up global use of it
    req.token = jwt.verify(token, process.env.TOKEN);

    // match token userId and userId 
    if (req.body.userId && req.body.userId !== req.token.userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid Token!"),
    });
  }
};
