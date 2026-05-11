const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Vérifie le JWT et attache l'utilisateur à req.user.
 * §37 — Sécurité Frontend : refresh token, expiration session, gestion 401
 */
async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user || !user.is_active) {
      return res.status(401).json({ success: false, message: 'Session invalide' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
}

module.exports = { authenticate };
