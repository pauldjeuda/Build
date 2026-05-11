const router = require('express').Router();
const { list, show, create, update } = require('../controllers/chantiers.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');
const catchAsync = require('../utils/catchAsync');

router.get('/',      authenticate, allow('view_all_chantiers', 'view_own_chantiers'), catchAsync(list));
router.get('/:id',   authenticate, allow('view_all_chantiers', 'view_own_chantiers'), catchAsync(show));
router.post('/',     authenticate, allow('create_chantier'),  catchAsync(create));
router.patch('/:id', authenticate, allow('edit_chantier'),    catchAsync(update));

module.exports = router;
