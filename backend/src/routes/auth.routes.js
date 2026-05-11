const router = require('express').Router();
const { login, me, logout } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

router.post('/login',  catchAsync(login));
router.get('/me',      authenticate, catchAsync(me));
router.post('/logout', authenticate, catchAsync(logout));

module.exports = router;
