// /routes/chatbotRoutes.js
const express = require('express');
const { check } = require('express-validator');
const { protect, admin } = require('../middleware/authMiddleware');
const { createOrUpdateConfig, getConfig } = require('../controllers/chatBotController')

const router = express.Router();

router.post(
    '/config',
    [
        protect,
        admin,
        check('welcomeMessage', 'Welcome message is required').not().isEmpty(),
        check('botName', 'Bot name is required').not().isEmpty(),
        check('triggers', 'Triggers must be an array').isArray(),
        check('triggers.*.keyword', 'Trigger keyword is required').not().isEmpty(),
        check('triggers.*.response', 'Trigger response is required').not().isEmpty(),
    ],
    createOrUpdateConfig
);

router.get('/config', getConfig); // No auth for chatbot access

module.exports = router;