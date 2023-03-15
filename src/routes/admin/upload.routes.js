const { Router } = require('express');
const router = Router();
const { auth, checkPermission } = require('../../middlewares/auth.middleware');
const { dropbox } = require('../../controllers/admin/upload.controller');
const PERMISSION = require('../../config/permission.config');

// API
router.post('/dropbox', auth, checkPermission(PERMISSION['view dashboard']), dropbox);

module.exports = router;
