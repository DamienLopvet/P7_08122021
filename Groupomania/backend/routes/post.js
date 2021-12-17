const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');
const limiter = require('../middleware/limiter')

router.post('/', auth, limiter.apiLimiter, multer, postCtrl.createPost);
router.delete('/:messageId', auth, limiter.apiLimiter, postCtrl.deletePost);
router.get('/:userId', auth, limiter.apiLimiter, postCtrl.getUserPosts);
router.get('/', auth, limiter.apiLimiter, postCtrl.getAllPosts);                          

module.exports = router;
