const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const categoriesController = require('../../controllers/admin/categories.controller');

// API
router.post('/datatables_ajax', authMiddleware.authRequire, categoriesController.ajaxDatatablesCategories);
router.post('/create', authMiddleware.authRequire, categoriesController.createCategory);
router.get('/read/:id', authMiddleware.authRequire, categoriesController.readCategory);
router.put('/update/:id', authMiddleware.authRequire, categoriesController.updateCategory);
router.delete('/delete/:id', authMiddleware.authRequire, categoriesController.deleteCategory);
router.patch('/restore/:id', authMiddleware.authRequire, categoriesController.restoreCategory);
router.delete('/destroy/:id', authMiddleware.authRequire, categoriesController.destroyCategory);
// PAGE
router.get('/', authMiddleware.authRequire, categoriesController.allCategories);
router.get('/trash', authMiddleware.authRequire, categoriesController.categoriesTrash);

module.exports = router;
