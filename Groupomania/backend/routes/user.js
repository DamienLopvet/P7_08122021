const express = require("express");

//import multer
const multer = require("../middleware/multer-config");

const auth = require("../middleware/auth");

//create router
const router = express.Router();

//import user controller
const userCtrl = require("../controllers/user");

//import strong password checker
const password = require("../middleware/password");

//import request limiter
const limiter = require("../middleware/limiter")

//set up module each route need to pass through
router.post("/signup", password, limiter.userLogLimiter, userCtrl.signup);
router.post("/signin", limiter.userLogLimiter, userCtrl.signin);
router.post("/signout", auth, userCtrl.signout);
router.put("/:userId/userModify", auth, userCtrl.modifyProfile);
router.get("/:userId", auth, userCtrl.getProfile);
router.delete("/:userId", auth, userCtrl.deleteProfile);

module.exports = router;
