const express = require('express');
const router = express.Router();


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const messagesCtrl = require('../controllers/message');
const limiter = require('../middleware/limiter')

router.post('/', auth, limiter.apiLimiter, multer, messagesCtrl.createMessage);
router.delete('/:messageId', auth, limiter.apiLimiter, messagesCtrl.deleteMessage);
router.get('/:userId', auth, limiter.apiLimiter, messagesCtrl.getOneMessage);
router.get('/', auth, limiter.apiLimiter, messagesCtrl.getAllMessage);                          

module.exports = router;
