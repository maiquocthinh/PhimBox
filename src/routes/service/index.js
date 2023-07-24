const express = require('express');
const router = express.Router();
const { internalServiceAuth } = require('../../middlewares/auth.middleware');
const { sendMailController } = require('../../controllers/service');

// API
router.post('/send-email', internalServiceAuth, sendMailController);

module.exports = router;
