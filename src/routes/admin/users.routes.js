const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const usersController = require('../../controllers/admin/users.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post(
	'/datatables_ajax',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse users']),
	usersController.ajaxDatatablesUsers,
);
router.post(
	'/create',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['create users']),
	usersController.createUser,
);
router.get(
	'/read/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse users']),
	usersController.readUser,
);
router.patch(
	'/update/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update users']),
	usersController.updateUser,
);
router.delete(
	'/delete/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete users']),
	usersController.deleteUser,
);
router.patch(
	'/restore/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update users']),
	usersController.restoreUser,
);
router.delete(
	'/destroy/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete users']),
	usersController.destroyUser,
);
// PAGE
router.get(
	'/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse users']),
	usersController.allUsers,
);

module.exports = router;
