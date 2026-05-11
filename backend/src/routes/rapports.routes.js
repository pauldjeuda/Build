const router = require('express').Router();
const { list, show, create, submit, validate, reject, update } = require('../controllers/rapports.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');
const catchAsync = require('../utils/catchAsync');

router.get('/',               authenticate, allow('view_rapports'),  catchAsync(list));
router.get('/:id',            authenticate, allow('view_rapports'),  catchAsync(show));
router.post('/',              authenticate, allow('create_rapport'), catchAsync(create));
router.patch('/:id',          authenticate, allow('create_rapport'), catchAsync(update));
router.patch('/:id/submit',   authenticate, allow('submit_rapport'), catchAsync(submit));
router.patch('/:id/validate', authenticate, allow('validate_rapport'), catchAsync(validate));
router.patch('/:id/reject',   authenticate, allow('reject_rapport'),   catchAsync(reject));

module.exports = router;
