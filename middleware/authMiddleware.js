const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.id);
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

exports.admin = async (req, res, next) => {
    if(req.user && req.user.role == 'admin'){
        next();

    }else {
    return res.status(403).json({ success: false, message: 'Not authorized as admin' });
  }
};