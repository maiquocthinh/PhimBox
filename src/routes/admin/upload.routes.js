const { Router } = require('express');
const router = Router();
const { auth, checkPermission } = require('../../middlewares/auth.middleware');
const { subtitle } = require('../../controllers/admin/upload.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post('/subtitle', auth, checkPermission(PERMISSION['view dashboard']), subtitle);

module.exports = router;
