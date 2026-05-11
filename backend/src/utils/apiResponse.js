/**
 * §38 — Structure réponse standard : { success, message, data }
 */

const ok = (res, data = null, message = 'OK', status = 200) =>
  res.status(status).json({ success: true, message, data });

const created = (res, data, message = 'Créé avec succès') =>
  ok(res, data, message, 201);

const badRequest = (res, message = 'Requête invalide', errors = null) =>
  res.status(400).json({ success: false, message, errors });

const unauthorized = (res, message = 'Non authentifié') =>
  res.status(401).json({ success: false, message });

const forbidden = (res, message = 'Accès refusé') =>
  res.status(403).json({ success: false, message });

const notFound = (res, message = 'Ressource introuvable') =>
  res.status(404).json({ success: false, message });

const serverError = (res, message = 'Erreur serveur interne') =>
  res.status(500).json({ success: false, message });

module.exports = { ok, created, badRequest, unauthorized, forbidden, notFound, serverError };
