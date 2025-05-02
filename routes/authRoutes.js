const express = require("express");
const { signup, login } = require("../controllers/authController");
const { check } = require("express-validator");



const router = express.Router();

// signup route
router.post(
    '/signup',
    [
        check('firstName', 'First name is required').not().isEmpty(),
        check('email', 'Please include a valid mail').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({min : 6}),
        check('confirmPassword', 'Confirm password is required').exists(),
    ],
    signup
);

// login route
router.post(
    '/login',
    [
        check('email', 'Please include a valid mail').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    login
);

module.exports = router;