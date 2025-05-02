// /controllers/metricsController

const Chat = require('../models/Chat');
const Ticket = require('../models/Ticket');

// Get metrics
exports.getMetrics = async (req, res, next) => {
    try {
        // Total chats
        const totalChats = await Chat.countDocuments();

        // Average reply time (user to agent/bot response)
        const chats = await Chat.find({ 'messages.1': { $exists: true } });
        let totalReplyTime = 0;
        let replyCount = 0;

        chats.forEach(chat => {
            for (let i = 0; i < chat.messages.length - 1; i++) {
                if (chat.messages[i].sender === 'user' && ['bot', 'agent'].includes(chat.messages[i + 1].sender)) {
                    const replyTime = chat.messages[i + 1].timestamp - chat.messages[i].timestamp;
                    totalReplyTime += replyTime;
                    replyCount++;
                }
            }
        });

        const averageReplyTime = replyCount > 0 ? totalReplyTime / replyCount / 1000 : 0; // Seconds

        // Resolved tickets percentage
        const totalTickets = await Ticket.countDocuments();
        const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
        const resolvedPercentage = totalTickets > 0 ? (resolvedTickets / totalTickets * 100).toFixed(2) : 0;

        // Missed chats for past 10 weeks
        const missedChats = {};
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Current week's Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        for (let i = 1; i <= 10; i++) {
            const weekStart = new Date(startOfWeek);
            weekStart.setDate(weekStart.getDate() - (i - 1) * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);

            const count = await Chat.countDocuments({
                missed: true,
                createdAt: { $gte: weekStart, $lt: weekEnd },
            });

            missedChats[`week${i}`] = count;
        }

        res.status(200).json({
            success: true,
            metrics: {
                totalChats,
                averageReplyTime: averageReplyTime.toFixed(2), // Seconds
                resolvedTicketsPercentage: resolvedPercentage,
                missedChats,
            },
        });
    } catch (error) {
        next(error);
    }
};