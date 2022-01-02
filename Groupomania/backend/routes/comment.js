const express = require('express');
const router = express.Router()

const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');
const limiter = require('../middleware/limiter')


router.post('/:postId/comment', auth, limiter.apiLimiter, commentCtrl.createComment);
router.delete('/comment/:commentId', auth, limiter.apiLimiter, commentCtrl.deleteComment);
module.exports = router;
