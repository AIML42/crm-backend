// /controllers/chatController.js
const { validationResult } = require('express-validator');
const Chat = require('../models/Chat');
const ChatbotConfig = require('../models/ChatbotConfig');
const Ticket = require('../models/Ticket');
const User = require('../models/User');

// Start new chat
exports.createChat = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { userInfo, message } = req.body;

    try {
        const config = await ChatbotConfig.findOne({});
        const welcomeMessage = config ? config.customizeMessage : 'Hello! How can I assist you today?';

        const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
        if (!firstAdmin) {
            return res.status(400).json({ success: false, message:'No admin' });
        }

        const chat = new Chat({
            userInfo,
            messages: [
                { sender: 'bot', content: welcomeMessage },
                { sender: 'user', content: message },
            ],
            firstMessageAt: Date.now(),
        });

        await chat.save()

        // Process user message
        const botResponse = await processUserMessage(message, chat._id);
        if (botResponse) {
            chat.messages.push({ sender: 'bot', content: botResponse });
        }

        await chat.save();

        res.status(201).json({
            success: true,
            chat: {
                id: chat._id,
                userInfo,
                messages: chat.messages,
                missed: chat.missed,
                createdAt: chat.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Add message to chat
exports.addMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { message, sender } = req.body;

    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }

        chat.messages.push({
            sender,
            content: message,
            timestamp: Date.now(),
        });

        let botResponse;
        if (sender === 'user') {
            // we will handle this in future.

            // botResponse = await processUserMessage(message, chat._id);


            // if (botResponse) {
            //     chat.messages.push({
            //         sender: 'bot',
            //         content: botResponse,
            //         timestamp: Date.now(),
            //     });
            // }
        }

        await chat.save();

        res.status(200).json({
            success: true,
            chat: {
                id: chat._id,
                userInfo: chat.userInfo,
                messages: chat.messages,
                missed: chat.missed,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get all chats to that particular user
exports.getChats = async (req, res, next) => {
    try {
        // 1. First find all tickets assigned to current user
        const tickets = await Ticket.find({
            assignedTo: req.user._id
        }).select('chatId'); // Only get chatId field

        // 2. Extract chat IDs from tickets (filtering out any null/undefined)
        const chatIds = tickets
            .map(ticket => ticket.chatId)
            .filter(chatId => chatId); // Remove null/undefined values

        // 3. If no chats found, return empty array
        if (chatIds.length === 0) {
            return res.status(200).json({
                success: true,
                chats: []
            });
        }

        // 4. Find all chats referenced by these tickets
        const chats = await Chat.find({
            _id: { $in: chatIds }
        }).populate('userInfo', 'firstName lastName email phone');

        res.status(200).json({
            success: true,
            chats,
        });
    } catch (error) {
        next(error);
    }
};

// Get chat by ID
exports.getChatById = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        res.status(200).json({
            success: true,
            chat,
        });
    } catch (error) {
        next(error);
    }
};

// Helper: Process user message and return bot response or create ticket
async function processUserMessage(message, chatId) {
    const config = await ChatbotConfig.findOne({});
    if (!config) {
        await createTicketFromChat(chatId, message);
        return 'Your query has been escalated to our support team.';
    }

    const trigger = config.triggers.find(t =>
        message.toLowerCase().includes(t.keyword.toLowerCase())
    );

    if (trigger) {
        return trigger.response;
    }

    // Use customizeMessage before escalating
    await createTicketFromChat(chatId, message);
    return 'Your query has been escalated to our support team.';
}

// Helper: Create ticket from chat
async function createTicketFromChat(chatId, message) {
    const chat = await Chat.findById(chatId);
    if (!chat) {
        throw new Error('Chat not found');
    }

    const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });
    if (!firstAdmin) {
        throw new Error('No admin found');
    }

    const ticket = new Ticket({
        message,
        userInfo: chat.userInfo,
        assignedTo: firstAdmin._id,
        chatId,
    });

    await ticket.save();
}