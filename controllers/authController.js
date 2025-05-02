const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT
const generateToken = (id, role, adminId) => {
    return jwt.sign({ id, role, adminId }, process.env.JWT_SECRET, {
        expiresIn: '2d',
    });
};

//signup

exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return (res.status(400).json({ success: false, errors: errors.array() }));
    }

    const { firstName, lastName, password, email, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    try {
        let user = await User.findOne({ email });
        console.log(user);

        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            role: "admin",
            updatedPassword: true,
        });

        await user.save();

        const token = generateToken(user._id, user.role, user.adminId);

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, firstName, lastName, email, role: user.role },
        });

    } catch (error) {
        next(error);
    }

};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return (res.status(400).json({ success: false, errors: errors.array() }));
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        }

        let isMatch;

        if (user.updatedPassword) {
            isMatch = await user.matchPassword(password);
        } else {
            const firstAdmin = await User.findById(user.adminId).select('+password');

            if (!firstAdmin) {
                return res.status(400).json({ success: false, message: 'No admin found' });
            }

            // console.log(firstAdmin);
            // console.log(password);

            isMatch = await firstAdmin.matchPassword(password);
        }

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });

        }

        const token =  generateToken(user.id, user.role, user.adminId);

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, firstName: user.firstName, 
                lastName: user.lastName, email: user.email, role: user.role },
        });

    } catch (error) {
        next(error);
    }

};