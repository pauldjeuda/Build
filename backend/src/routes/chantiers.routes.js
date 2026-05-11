const router = require('express').Router();
const { list, show, create, update } = require('../controllers/chantiers.controller');
const { authenticate } = require('../middleware/auth');
const { allow } = require('../middleware/rbac');

router.get('/',    authenticate, allow('view_all_chantiers', 'view_own_chantiers'), list);
router.get('/:id', authenticate, allow('view_all_chantiers', 'view_own_chantiers'), show);
router.post('/',   authenticate, allow('create_chantier'), create);
router.patch('/:id', authenticate, allow('edit_chantier'), update);

module.exports = router;
