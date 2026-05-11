/**
 * Wrapper Express 4 — catch les rejections de promesses async et les passe à next(err)
 * pour que le global error handler les intercepte.
 * En Express 5 ce serait natif, mais on est sur Express 4.
 */
module.exports = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
