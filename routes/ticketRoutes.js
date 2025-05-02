// /routes/ticketRoutes.js
const express = require('express');
const { check } = require('express-validator');
const { protect, admin } = require('../middleware/authMiddleware');
const { createTicket, getTickets, getAssignedTickets, updateTicket, deleteTicket } = require('../controllers/ticketController');

const router = express.Router();

router.post(
    '/',
    [
        protect,
        admin,
        check('message', 'Message is required').not().isEmpty(),
        check('userInfo.name', 'User name is required').not().isEmpty(),
        check('userInfo.phone', 'User phone is required').not().isEmpty(),
        check('userInfo.email', 'Please include a valid email').isEmail(),
        check('chatId', 'Chat ID must be a valid ObjectId').optional().isMongoId(),
    ],
    createTicket
);

router.get(
    '/',
    [
        protect,
        admin,
        check('status', 'Status must be resolved or unresolved').optional().isIn(['resolved', 'unresolved']),
        check('phone', 'Phone must be a string').optional().isString(),
        check('email', 'Email must be valid').optional().isEmail(),
    ],
    getTickets
);

router.get('/assigned', [protect], getAssignedTickets);

router.patch(
    '/:id',
    [
        protect,
        admin,
        check('message', 'Message must not be empty').optional().not().isEmpty(),
        check('status', 'Status must be resolved or unresolved').optional().isIn(['resolved', 'unresolved']),
        check('assignedTo', 'AssignedTo must be a valid ObjectId').optional().isMongoId(),
    ],
    updateTicket
);

router.delete('/:id', [protect, admin], deleteTicket);

module.exports = router;