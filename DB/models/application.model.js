import mongoose from "mongoose";

//============================== create the user schema ==============================//
const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userTechSkills: [
        String,
    ],
    userSoftSkills: [
        String,
    ],
    userResume: [
        {
            secure_url: String,
            public_id: String,
        }
    ],
    folderId: String,

}, { timestamps: true, })



export default mongoose.models.Application || mongoose.model('Application', applicationSchema)

