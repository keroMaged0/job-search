import mongoose from "mongoose";

//============================== create the user schema ==============================//
const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        minlength: [2, 'too short user email'],
        maxlength: [50, 'too short user email'],
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        required: true,
        minlength: [20, 'too short user name'],
        maxlength: [300, 'too short user name'],
        lowercase: true
    },
    industry: {
        type: String,
    },
    address: {
        type: String,
    },
    numberOfEmployees: {
        type: Number,
        required: true,
        min: [11, 'too short user name'],
        max: [20, 'too short user name'],
    },
    companyEmail: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    companyHR: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
 })

companySchema.virtual('Job', {
    ref: 'Job',
    localField: '_id',
    foreignField: 'companyId'
})

export default mongoose.models.Company || mongoose.model('Company', companySchema)

