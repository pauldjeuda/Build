const router = require('express').Router();
const { list, unreadCount, markRead, markAllRead } = require('../controllers/notifications.controller');
const { authenticate } = require('../middleware/auth');

router.get('/',             authenticate, list);
router.get('/unread-count', authenticate, unreadCount);
router.patch('/read-all',   authenticate, markAllRead);
router.patch('/:id/read',   authenticate, markRead);

module.exports = router;
