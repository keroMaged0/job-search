import mongoose from "mongoose";

//============================== create the user schema ==============================//
const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },
    jobLocation: {
        type: String,
        enum: ['onsite', 'remotely', 'hybrid'],
        default: 'onsite',
    },
    workingTime: {
        type: String,
        enum: ['part-time', 'full-time'],
        default: 'full-time',
    },
    seniorityLevel: {
        type: String,
        enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
        default: 'Mid-Level',
    },
    jobDescription: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        minlength: [20, 'too short user jobDescription'],
        maxlength: [500, 'too short user jobDescription'],
    },
    technicalSkills: [
        {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        }
    ],
    softSkills: [
        {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        }
    ],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },


}, { timestamps: true })



export default mongoose.models.Job || mongoose.model('Job', jobSchema)

