const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const rolesController = require('../../controllers/admin/roles.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post(
	'/datatables_ajax',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse roles']),
	rolesController.ajaxDatatablesRoles,
);
router.post(
	'/create',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['create roles']),
	rolesController.createRole,
);
router.get(
	'/read/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse roles']),
	rolesController.readRole,
);
router.patch(
	'/update/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update roles']),
	rolesController.updateRole,
);
router.delete(
	'/delete/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete roles']),
	rolesController.deleteRole,
);

// PAGE
router.get('/', authMiddleware.auth, authMiddleware.checkPermission(PERMISSION['browse roles']), rolesController.allRoles);

module.exports = router;
