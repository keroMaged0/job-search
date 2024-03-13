import userModel from "../../../DB/models/user.model.js"
import { catchError } from "../../middleware/global-response.middleware.js"

import cloudinaryConnection from "../../utils/cloudinary.js"

import { appError } from "../../utils/app.Error.js"
import generateUniqueString from "../../utils/generate-Unique-String.js"
import applicationModel from "../../../DB/models/application.model.js"
import jobModel from "../../../DB/models/job.model.js"

//=================================== apply to job controller ===================================// (done)
/* 
    * destruct required data
    * check user
    * check job
    * if not send CV
    * upload userResume in cloudinary
    * create job object
    * save job object in database
*/
const applyToJob = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { jobId } = req.params
        const { userTechSkills, userSoftSkills } = req.body

        // check user
        let user = await userModel.findById(_id)
        if (!user) return next(new appError('!not found user', 401))

        // check job
        let job = await jobModel.findById(jobId)
        if (!job) return next(new appError('!not found job', 401))

        // if not found file in body
        if (!req.file) return next(new appError('must be send CV', 400))

        // create unique folderId
        const folderId = generateUniqueString(4)

        // upload userResume in cloudinary
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(
            req.file.path,
            {
                folder: `JobApplication/applyToJob/${folderId}`,
            }
        )

        // if error rollback upload file
        req.folder = `JobApplication/applyToJob/${folderId}`

        // create job object
        let jobObject = {
            jobId,
            userId: _id,
            userTechSkills,
            userSoftSkills,
            userResume: { secure_url, public_id },
            folderId
        }

        // save job object to database
        const application = applicationModel(jobObject)
        await application.save()

        // if error rollback document to remove to db 
        req.document = { model: applicationModel, modelId: application._id }

        res.json({ success: true, message: "successfully", data: application })
    }
)

//=================================== delete one application controller ===================================// (done)
/* 
    * destruct applicationId params
    * check if owner of application and delete to database
    * delete application to cloudinary 
*/
const deleteOneApplication = catchError(
    async (req, res, next) => {
        // destruct applicationId params
        const { applicationId } = req.params

        // check if owner of application
        let application = await applicationModel.findByIdAndDelete(applicationId)
        if (!application) return next(new appError('!not found application', 401))

        // path folder in cloudinary
        let folderDelete = `JobApplication/applyToJob/${application.folderId}`

        // delete folder from cloudinary
        await cloudinaryConnection().api.delete_resources_by_prefix(folderDelete)
        await cloudinaryConnection().api.delete_folder(folderDelete)


        res.json({ success: true, message: "deleted application successfully", data: application })

    }
)

//=================================== get all Application on job controller ===================================// (done)
/* 
    * destruct jobId params
    * check if owner of job 
    * get all Application on job 
*/
const getAllApplicationOneJob = catchError(
    async (req, res, next) => {
        // destruct applicationId params
        const { jobId } = req.params
        const { _id } = req.user

        // check if owner of job
        let job = await jobModel.findOne({ _id: jobId, addedBy: _id })
        if (!job) return next(new appError('!not found job', 401))

        // get all application related jobs
        let application = await applicationModel.find({ jobId: job._id }).populate([
            {
                path: 'jobId',
            }
        ])
        if (!application) return next(new appError('!not found application', 401))

        res.json({ success: true, message: "deleted application successfully", data: application })

    }
)


export {
    applyToJob,
    deleteOneApplication,
    getAllApplicationOneJob
}