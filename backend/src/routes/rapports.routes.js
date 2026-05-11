const router = require('express').Router();
const { list, show, create, submit, validate, reject, update } = require('../controllers/rapports.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

router.get('/',               authenticate, allow('view_rapports'), list);
router.get('/:id',            authenticate, allow('view_rapports'), show);
router.post('/',              authenticate, allow('create_rapport'), create);
router.patch('/:id',          authenticate, allow('create_rapport'), update);
router.patch('/:id/submit',   authenticate, allow('submit_rapport'), submit);
router.patch('/:id/validate', authenticate, allow('validate_rapport'), validate);
router.patch('/:id/reject',   authenticate, allow('reject_rapport'), reject);

module.exports = router;
