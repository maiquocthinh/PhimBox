const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const categoriesController = require('../../controllers/admin/categories.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post(
	'/datatables_ajax',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse categories']),
	categoriesController.ajaxDatatablesCategories,
);
router.post(
	'/create',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['create categories']),
	categoriesController.createCategory,
);
router.get(
	'/read/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse categories']),
	categoriesController.readCategory,
);
router.put(
	'/update/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update categories']),
	categoriesController.updateCategory,
);
router.delete(
	'/delete/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete categories']),
	categoriesController.deleteCategory,
);
router.patch(
	'/restore/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['update categories']),
	categoriesController.restoreCategory,
);
router.delete(
	'/destroy/:id',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['delete categories']),
	categoriesController.destroyCategory,
);
// PAGE
router.get(
	'/',
	authMiddleware.auth,
	authMiddleware.checkPermission(PERMISSION['browse categories']),
	categoriesController.allCategories,
);

module.exports = router;
