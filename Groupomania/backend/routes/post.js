const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');
const limiter = require('../middleware/limiter')

router.post('/', auth, limiter.apiLimiter, multer, postCtrl.createPost);
router.put('/:messageId', auth, limiter.apiLimiter, multer, postCtrl.modifyPost)
router.delete('/:messageId', auth, limiter.apiLimiter, postCtrl.deletePost);
router.get('/:userId', auth, limiter.apiLimiter, postCtrl.getUserPosts);
router.get('/', limiter.apiLimiter, postCtrl.getAllPosts);                          

module.exports = router;
