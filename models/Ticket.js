// /models/Ticket.js

const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    ticketNumber: {
        type: String,
        // required: true,
        unique: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    elapsedTime: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['resolved', 'unresolved'],
        default: 'unresolved',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userInfo: {
        name: { type: String, required: [true, 'Name is required'] },
        phone: { type: String, required: [true, 'Phone is required'] },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
});

// Generate unique ticket number (YYYY-(ID)-MMDD)
TicketSchema.pre('save', async function (next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const count = await mongoose.model('Ticket').countDocuments();
        this.ticketNumber = `${year}-${String(count + 1).padStart(3, '0')}-${month}${day}`;
    }
    this.elapsedTime = Date.now() - this.createdAt.getTime();
    next();
});

module.exports = mongoose.model('Ticket', TicketSchema);