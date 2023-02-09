const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const categoriesController = require('../../controllers/admin/categories.controller');

// API
router.post('/datatables_ajax', authMiddleware.auth, categoriesController.ajaxDatatablesCategories);
router.post('/create', authMiddleware.auth, categoriesController.createCategory);
router.get('/read/:id', authMiddleware.auth, categoriesController.readCategory);
router.put('/update/:id', authMiddleware.auth, categoriesController.updateCategory);
router.delete('/delete/:id', authMiddleware.auth, categoriesController.deleteCategory);
router.patch('/restore/:id', authMiddleware.auth, categoriesController.restoreCategory);
router.delete('/destroy/:id', authMiddleware.auth, categoriesController.destroyCategory);
// PAGE
router.get('/', authMiddleware.auth, categoriesController.allCategories);
router.get('/trash', authMiddleware.auth, categoriesController.categoriesTrash);

module.exports = router;
