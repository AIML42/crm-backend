// /routes/chatRoutes.js
const express = require('express');
const { check } = require('express-validator');
const { protect, admin } = require('../middleware/authMiddleware');
const { createChat, addMessage, getChats, getChatById } = require('../controllers/chatController');

const router = express.Router();

router.post(
    '/',
    [
        check('userInfo.name', 'User name is required').not().isEmpty(),
        check('userInfo.phone', 'User phone is required').not().isEmpty(),
        check('userInfo.email', 'Please include a valid email').isEmail(),
        check('message', 'Message is required').not().isEmpty(),
    ],
    createChat
);

router.post(
    '/:id/message',
    [
        check('message', 'Message is required').not().isEmpty(),
        check('sender', 'Sender must be user, bot, or agent').isIn(['user', 'bot', 'agent']),
    ],
    addMessage
);

router.get('/', [protect, admin], getChats);

router.get('/:id', [protect, admin], getChatById);

module.exports = router;