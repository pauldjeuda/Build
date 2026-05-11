const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ok, created, badRequest, unauthorized } = require('../utils/apiResponse');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return badRequest(res, 'Email et mot de passe requis');

  const user = await User.findOne({ where: { email: email.toLowerCase(), is_active: true } });
  if (!user) return unauthorized(res, 'Identifiants incorrects');

  const valid = await user.comparePassword(password);
  if (!valid) return unauthorized(res, 'Identifiants incorrects');

  const token = signToken(user);
  return ok(res, { token, user });
}

// GET /api/auth/me
async function me(req, res) {
  return ok(res, req.user);
}

// POST /api/auth/logout — le frontend supprime le token ; le backend peut blacklister si besoin
async function logout(req, res) {
  return ok(res, null, 'Déconnecté');
}

module.exports = { login, me, logout };
