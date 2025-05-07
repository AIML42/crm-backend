const User = require("../models/User");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");

// Generate random password
const generateRandomPassword = () => {
    return crypto.randomBytes(8).toString('hex').slice(0, 12); // 12-character random password
};

// Add member
exports.addMember = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, email, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const creator = await User.findById(req.user.id);
        const randomPassword = generateRandomPassword();

        user = new User({
            firstName,
            email,
            password: randomPassword,
            adminId: req.user.id,
            role,
            updatedPassword: false,
        });

        await user.save();

        res.status(201).json({
            success: true,
            member: {
                id: user._id,
                firstName,
                email,
                role,
                adminId: user.adminId
            },
        });

    } catch (error) {
        next(error);
    }
};


// Get all members
exports.getMembers = async (req, res, next) => {
    try {
        const members = await User.find({}).select('-password');
        res.status(200).json({
            success: true,
            members,
        });
    } catch (error) {
        next(error);
    }
};

// Update a member
exports.updateMember = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { firstName, lastName, email, password, confirmPassword, role } = req.body;

    try {

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }


        if (password && password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }


        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.role = role || user.role;

        // Only update password if provided
        if (password) {

            user.password = password; 
            user.updatedPassword = true; 


        }

        await user.save();

        res.status(200).json({
            success: true,
            member: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
        });

    } catch (error) {
        next(error);
    }
};

// Delete a member
exports.deleteMember = async (req, res, next) => {
    try {
        // Add await
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};