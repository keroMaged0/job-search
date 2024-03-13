import companyModel from "../../../DB/models/company.model.js"
import jobModel from "../../../DB/models/job.model.js"
import userModel from "../../../DB/models/user.model.js"
import { catchError } from "../../middleware/global-response.middleware.js"
import { apiFeature } from "../../service/api_feature.js"

import { appError } from "../../utils/app.Error.js"

//=================================== add job controller ===================================// (done)
/* 
    * destruct required data
    * check if owner is added job 
    * create new job
    * save new job in database
*/
const addJob = catchError(
    async (req, res, next) => {
        // destruct required data
        const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId } = req.body
        const { _id } = req.user


        // check if owner is add job
        let ownerCompany = await companyModel.findOne({ companyHR: _id })
        if (!ownerCompany) { return next(new appError("unauthorized hr", 401)) }

        // check company
        let existCompany = await companyModel.findById(companyId)
        if (!existCompany) return next(new appError('company not found', 404))

        // create job object
        const jobObject = {
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills,
            addedBy: _id,
            companyId
        }

        // save job object to database
        const job = jobModel(jobObject)
        await job.save()

        res.json({ success: true, message: "job saved successfully", data: job })
    }
)


//=================================== Update company data controller ===================================// (done)
/* 
    * destruct data from body
    * check if body not empty
    * check if owner job
    * check if in title
    * check if update in location
    * check if update in working time
    * check if update in seniority level
    * check if update in job description
    * check if update in job technical skills
    * check if update in soft skills
    * save new data in db   

*/
const updateJob = catchError(
    async (req, res, next) => {
        // destruct required data
        const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body
        const { _id } = req.user
        const { jobId } = req.params

        // check if body not empty
        if (Object.keys(req.body).length === 0) return res.json({ success: false, message: "not found data needed to update" })

        // check if owner 
        let ownerJob = await jobModel.findOne({ _id: jobId, addedBy: _id })
        if (!ownerJob) { return next(new appError("unauthorized", 401)) }

        // if update in job title
        if (jobTitle) {
            // if match old title
            if (ownerJob.jobTitle.toString() === jobTitle) return res.json({ message: "title already matches" })
            ownerJob.jobTitle = jobTitle
        }

        // if update in job location
        if (jobLocation) {
            // if match old location
            if (ownerJob.jobLocation.toString() === jobLocation) return res.json({ message: "location already matches" })
            ownerJob.jobLocation = jobLocation
        }

        // if update in working time    
        if (workingTime) {
            // if match old working time
            if (ownerJob.workingTime.toString() === workingTime) return res.json({ message: "working time already matches" })
            ownerJob.workingTime = workingTime
        }

        // if update in seniority level
        if (seniorityLevel) {
            // if match old seniority level
            if (ownerJob.seniorityLevel.toString() === seniorityLevel) return res.json({ message: "seniority level already matches" })
            ownerJob.seniorityLevel = seniorityLevel
        }

        // if update in job description
        if (jobDescription) {
            // if match old job description
            if (ownerJob.jobDescription.toString() === jobDescription) return res.json({ message: "job description already matches" })
            ownerJob.jobDescription = jobDescription
        }

        // if update in technical skills
        if (technicalSkills) {
            // if match old technical skills
            if (ownerJob.technicalSkills.toString() === technicalSkills) return res.json({ message: "technical skills already matches" })
            ownerJob.technicalSkills = technicalSkills
        }

        // if update in soft skills
        if (softSkills) {
            // if match old soft skills
            if (ownerJob.softSkills.toString() === softSkills) return res.json({ message: "soft skills already matches" })
            ownerJob.softSkills = softSkills
        }

        // save job object to database
        await ownerJob.save()

        res.json({ success: true, message: "job updated successfully", data: ownerJob })
    }
)

//=================================== Delete company data controller ===================================// (done)
/*
    * destruct required data
    * find job by id
    * check if owner 
*/
const deleteJob = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { jobId } = req.params

        // check company and owner delete job
        let job = await jobModel.findOneAndDelete({ _id: jobId, addedBy: _id })
        if (!job) return next(new appError('company not found', 404))

        res.json({ success: true, message: "Company deleted successfully", data: job })

    }
)

//=================================== Get all Jobs for a specific company controller  ===================================// (done)
/*
    * find job by id
    * check if owner
*/
const GetAllJobsCompany = catchError(
    async (req, res, next) => {

        // Find company by name
        let company = await companyModel.find()
            .populate([
                {
                    path: 'Job'
                }
            ]);


        if (!company) return next(new appError('company not found', 404))

        console.log(company);
        res.json({ success: true, message: "successfully", data: company })

    }
)

//=================================== Get all Jobs for company's controller  ===================================// (done)
/*
    * destruct required data
    * find company by id
    * check if owner 
    * soft delete company
*/
const GetAllJobOneCompany = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { companyName } = req.query

        // Find company by name
        let company = await companyModel.findOne({ companyName: companyName })
            .populate([
                {
                    path: 'Job'
                }
            ]);


        if (!company) return next(new appError('company not found', 404))

        res.json({ success: true, message: "successfully", data: company })

    }
)

//=================================== Search for a job with a name ===================================// (done)
/*
    * destruct required data
    * find job by search
*/
const searchJob = catchError(
    async (req, res, next) => {
        // destruct required data
        const { page, size, sort, ...query } = req.query;

        // Debugging: Log the req object to inspect its structure
        const ApiFeature = new apiFeature(req.query, jobModel.find())
            .pagination()
            .sort()
            .search(query)
            .filter(query);

        const company = await ApiFeature.mongooseQuery
        .populate('companyId')
        if (!company) return next(new appError('company not found', 404))

        res.json({ success: true, message: "successfully", data: company })

    }
)




export {
    addJob,
    updateJob,
    deleteJob,
    GetAllJobOneCompany,
    GetAllJobsCompany,
    searchJob
}