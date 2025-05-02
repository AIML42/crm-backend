// /controllers/ticketController

const { validationResult } = require('express-validator');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Create ticket
exports.createTicket = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { message, userInfo, chatId } = req.body;

    try {
        const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
        if (!firstAdmin) {
            return res.status(400).json({ success: false, message: 'No admin found' });
        }

        const ticket = new Ticket({
            message,
            userInfo,
            assignedTo: firstAdmin._id,
            chatId,
        });

        await ticket.save();

        res.status(201).json({
            success: true,
            ticket: {
                id: ticket._id,
                ticketNumber: ticket.ticketNumber,
                message,
                userInfo,
                status: ticket.status,
                assignedTo: ticket.assignedTo,
                chatId: ticket.chatId,
                createdAt: ticket.createdAt,
                elapsedTime: ticket.elapsedTime,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get all tickets with filters
exports.getTickets = async (req, res, next) => {
    try {
        const { status, phone, email } = req.query;
        const query = {};

        if (status && ['resolved', 'unresolved'].includes(status)) {
            query.status = status;
        }
        if (phone) {
            query['userInfo.phone'] = { $regex: phone, $options: 'i' };
        }
        if (email) {
            query['userInfo.email'] = { $regex: email, $options: 'i' };
        }

        const tickets = await Ticket.find(query).populate('assignedTo', 'firstName lastName email');
        res.status(200).json({
            success: true,
            tickets,
        });
    } catch (error) {
        next(error);
    }
};

// Get tickets assigned to the user
exports.getAssignedTickets = async (req, res, next) => {
    try {
        const tickets = await Ticket.find({ assignedTo: req.user._id })
            .populate('assignedTo', 'firstName lastName email');
        res.status(200).json({
            success: true,
            tickets,
        });
    } catch (error) {
        next(error);
    }
};

// Update ticket
exports.updateTicket = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { message, status, assignedTo } = req.body;

    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        if (assignedTo) {
            const user = await User.findById(assignedTo);
            if (!user) {
                return res.status(400).json({ success: false, message: 'Assigned user not found' });
            }
        }

        ticket.message = message || ticket.message;
        ticket.status = status || ticket.status;
        ticket.assignedTo = assignedTo || ticket.assignedTo;

        await ticket.save();

        await ticket.populate('assignedTo', 'firstName lastName email');

        res.status(200).json({
            success: true,
            ticket,
        });
    } catch (error) {
        next(error);
    }
};

// Delete ticket
exports.deleteTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        await ticket.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Ticket deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};