const { ValidationError, UniqueConstraintError } = require('sequelize');

function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);

  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    return res.status(400).json({
      success: false,
      message: 'Validation échouée',
      errors: err.errors?.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }

  const status = err.statusCode || err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
  });
}

module.exports = errorHandler;
