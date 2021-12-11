const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const comentsCtrl = require('../controllers/coments');
const limiter = require('../middleware/limiter')


router.post('/:messageId/coment', auth, limiter.apiLimiter, comentsCtrl.createComent);
router.delete('/coment/:userId', auth, limiter.apiLimiter, comentsCtrl.deleteComent);
