const { Router } = require('express');
const router = Router();
const authMiddleware = require('../../app/middlewares/auth.middleware');
const membersController = require('../../app/controllers/admin/members.controller');

router.get('/', authMiddleware.authRequire, membersController.allMembers);
router.post('/datatables_ajax', authMiddleware.authRequire, membersController.ajaxDatatablesUsers);
router.post('/create', authMiddleware.authRequire, membersController.createMember);
router.get('/read/:id', authMiddleware.authRequire, membersController.readMember);
router.patch('/update/:id', authMiddleware.authRequire, membersController.updateMember);
router.delete('/delete/:id', authMiddleware.authRequire, membersController.deleteMember);
router.patch('/restore/:id', authMiddleware.authRequire, membersController.restoreMember);
router.delete('/destroy/:id', authMiddleware.authRequire, membersController.destroyMember);
router.get('/trash', authMiddleware.authRequire, membersController.membersTrash);

module.exports = router;
