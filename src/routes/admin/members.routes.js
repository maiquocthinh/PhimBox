const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const membersController = require('../../controllers/admin/members.controller');

// API
router.post('/datatables_ajax', authMiddleware.auth, membersController.ajaxDatatablesUsers);
router.post('/create', authMiddleware.auth, membersController.createMember);
router.get('/read/:id', authMiddleware.auth, membersController.readMember);
router.patch('/update/:id', authMiddleware.auth, membersController.updateMember);
router.delete('/delete/:id', authMiddleware.auth, membersController.deleteMember);
router.patch('/restore/:id', authMiddleware.auth, membersController.restoreMember);
router.delete('/destroy/:id', authMiddleware.auth, membersController.destroyMember);
// PAGE
router.get('/', authMiddleware.auth, membersController.allMembers);
router.get('/trash', authMiddleware.auth, membersController.membersTrash);

module.exports = router;
