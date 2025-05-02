// /models/ChatbotConfig

const mongoose = require('mongoose');

const ChatbotConfigSchema = new mongoose.Schema({
    botName : {
        type: String,
        required: [true, 'bot name is required']
    },
    welcomeMessage: {
        type: String,
        required: [true, 'Welcome message is required'],
        default: 'Hello! How can I assist you today?',
    },
    headerColor: {
        type: String,
        required: [true, 'Header color is required'],
        default: '#007BFF', // Blue
        match: [/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color'],
    },
    backgroundColor: {
        type: String,
        required: [true, 'Background color is required'],
        default: '#FFFFFF', // White
        match: [/^#([0-9A-F]{3}){1,2}$/i, 'Invalid hex color'],
    },
    customizeMessage: {
        type: String,
        required: [true, 'Customize message is required'],
        default: 'I’m not sure how to help with that. Let me connect you to our support team.',
    },
    missedChatTimeout: {
        type: Number,
        required: [true, 'Missed chat timeout is required'],
        default: 3600000, // 5 minutes
        min: [60000, 'Timeout must be at least 1 minute'],
    },
    introductionForm: {
        name: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        phone: { type: Boolean, default: true },
    },
    triggers: [{
        keyword: {
            type: String,
            required: true,
        },
        response: {
            type: String,
            required: true,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ChatbotConfig', ChatbotConfigSchema);