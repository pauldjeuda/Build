const router = require('express').Router();
const { list, unreadCount, markRead, markAllRead } = require('../controllers/notifications.controller');
const { authenticate } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');

router.get('/',             authenticate, catchAsync(list));
router.get('/unread-count', authenticate, catchAsync(unreadCount));
router.patch('/read-all',   authenticate, catchAsync(markAllRead));
router.patch('/:id/read',   authenticate, catchAsync(markRead));

module.exports = router;
