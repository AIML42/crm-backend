// /models/Chat
const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    userInfo: {
        name: { type: String, required: [true, 'Name is required'] },
        phone: { type: String, required: [true, 'Phone is required'] },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
    },
    messages: [{
        sender: {
            type: String,
            enum: ['user', 'bot', 'agent'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
    }],
    firstMessageAt: {
        type: Date,
        required: true,
    },
    missed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Mark chat as missed if no response within timeout (use ChatbotConfig)
ChatSchema.pre('save', async function (next) {
    if (this.isModified('messages') && this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1];
        if (lastMessage.sender === 'user' && !this.missed) {
            const config = await mongoose.model('ChatbotConfig').findOne({});
            const timeout = config ? config.missedChatTimeout : 300000; // Default 5 minutes
            const timeSinceFirstMessage = Date.now() - this.firstMessageAt.getTime();
            if (timeSinceFirstMessage > timeout) {
                this.missed = true;
            }
        }
    }
    next();
});

module.exports = mongoose.model('Chat', ChatSchema);