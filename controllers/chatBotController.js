// /controllers/chatbotController.js
const { validationResult } = require('express-validator');
const ChatbotConfig = require('../models/ChatbotConfig');

// Create or update chatbot config
exports.createOrUpdateConfig = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {botName, welcomeMessage, headerColor, backgroundColor, customizeMessage, missedChatTimeout, introductionForm, triggers } = req.body;

    try {
        let config = await ChatbotConfig.findOne({});
        if (config) {
            config.botName = botName || config.botName;
            config.welcomeMessage = welcomeMessage || config.welcomeMessage;
            config.headerColor = headerColor || config.headerColor;
            config.backgroundColor = backgroundColor || config.backgroundColor;
            config.customizeMessage = customizeMessage || config.customizeMessage;
            config.missedChatTimeout = missedChatTimeout || config.missedChatTimeout;
            config.introductionForm = introductionForm || config.introductionForm;
            config.triggers = triggers || config.triggers;
        } else {
            config = new ChatbotConfig({
                botName,
                welcomeMessage,
                headerColor,
                backgroundColor,
                customizeMessage,
                missedChatTimeout,
                introductionForm,
                triggers,
            });
        }

        await config.save();

        res.status(200).json({
            success: true,
            config,
        });
    } catch (error) {
        next(error);
    }
};

// Get chatbot config
exports.getConfig = async (req, res, next) => {
    try {
        const config = await ChatbotConfig.findOne({});
        if (!config) {
            return res.status(404).json({ success: false, message: 'Chatbot config not found' });
        }
        res.status(200).json({
            success: true,
            config,
        });
    } catch (error) {
        next(error);
    }
};