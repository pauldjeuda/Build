const { Notification } = require('../models');
const { ok, notFound } = require('../utils/apiResponse');

// GET /api/notifications — notifications de l'utilisateur connecté
async function list(req, res) {
  const notifications = await Notification.findAll({
    where: { user_id: req.user.id },
    order: [['created_at', 'DESC']],
    limit: parseInt(req.query.limit || 50),
  });
  return ok(res, notifications);
}

// GET /api/notifications/unread-count
async function unreadCount(req, res) {
  const count = await Notification.count({
    where: { user_id: req.user.id, lu: false },
  });
  return ok(res, { count });
}

// PATCH /api/notifications/:id/read
async function markRead(req, res) {
  const notif = await Notification.findOne({
    where: { id: req.params.id, user_id: req.user.id },
  });
  if (!notif) return notFound(res, 'Notification introuvable');
  await notif.update({ lu: true, lu_at: new Date() });
  return ok(res, notif);
}

// PATCH /api/notifications/read-all
async function markAllRead(req, res) {
  await Notification.update(
    { lu: true, lu_at: new Date() },
    { where: { user_id: req.user.id, lu: false } }
  );
  return ok(res, null, 'Toutes les notifications marquées comme lues');
}

module.exports = { list, unreadCount, markRead, markAllRead };
