const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const usersController = require('../../controllers/admin/users.controller');

// API
router.post('/datatables_ajax', authMiddleware.auth, usersController.ajaxDatatablesUsers);
router.post('/create', authMiddleware.auth, usersController.createUser);
router.get('/read/:id', authMiddleware.auth, usersController.readUser);
router.patch('/update/:id', authMiddleware.auth, usersController.updateUser);
router.delete('/delete/:id', authMiddleware.auth, usersController.deleteUser);
router.patch('/restore/:id', authMiddleware.auth, usersController.restoreUser);
router.delete('/destroy/:id', authMiddleware.auth, usersController.destroyUser);
// PAGE
router.get('/', authMiddleware.auth, usersController.allUsers);

module.exports = router;
