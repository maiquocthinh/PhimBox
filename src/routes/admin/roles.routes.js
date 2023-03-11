const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const usersController = require('../../controllers/admin/roles.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post(
	'/datatables_ajax',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse roles']),
	usersController.ajaxDatatablesUsers,
);
router.post(
	'/create',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['create roles']),
	usersController.createUser,
);
router.get(
	'/read/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse roles']),
	usersController.readUser,
);
router.patch(
	'/update/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update roles']),
	usersController.updateUser,
);
router.delete(
	'/delete/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete roles']),
	usersController.deleteUser,
);

// PAGE
router.get(
	'/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse roles']),
	usersController.allUsers,
);

module.exports = router;
