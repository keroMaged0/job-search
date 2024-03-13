import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { systemRoles } from "../../src/utils/system-roles.js";

//============================== create the user schema ==============================//
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true,
        minlength: [2, 'too short user name'],
        maxlength: [50, 'too short user name'],
        lowercase: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        minlength: [2, 'too short user name'],
        maxlength: [50, 'too short user name'],
        lowercase: true
    },
    username: {
        type: String,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        // unique: [true, 'email is required'],
        trim: true,
        required: true,
        lowercase: true
    },
    recoveryEmail: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    DOB: {
        type: Date,
        required: true,
    },
    phonNumbers: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: [systemRoles.ADMIN, systemRoles.C_CR, systemRoles.USER],
        default: systemRoles.USER
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'online',
    },
    EmailVerified: {
        type: Boolean,
        default: false,
    },
    loggedIn: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    resetPassword: {
        type: Boolean,
        default: false
    },
    changePasswordTime: Date,

}, { timestamps: true })

// hash password pre save
userSchema.pre('save', function () {
    if (this.password) this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUNDS)
})


userSchema.pre('findOneAndUpdate', function () {
    if (this._update.password) this._update.password = bcrypt.hashSync(this._update.password, +process.env.SALT_ROUNDS)
})

export default mongoose.models.User || mongoose.model('User', userSchema)

