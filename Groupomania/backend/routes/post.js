const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');
const limiter = require('../middleware/limiter')


router.post('/send', auth, limiter.apiLimiter, multer, postCtrl.createPost);
router.put('/:messageId', auth, limiter.apiLimiter, multer, postCtrl.modifyPost)
router.delete('/delete/:messageId', auth, limiter.apiLimiter, postCtrl.deletePost);
router.get('/:userName', auth, limiter.apiLimiter, postCtrl.getUserPosts);
router.get('/',auth,  postCtrl.getAllPosts);                          

module.exports = router;
