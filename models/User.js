// /models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },

    lastName: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Email is required'],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },

    role: {                                                                                                                                                                             
        type: String,
        enum: ['admin', 'team'],
        default: 'admin',
    },                                                                  
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () {
            return this.role === 'team'; 
        },
    },
    updatedPassword: {
        type: Boolean,                                      
        default: false,
    },          
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

// Encrypt password before saving
UserSchema.pre("save", async function(next){

    if(!this.isModified('password')){
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', UserSchema);