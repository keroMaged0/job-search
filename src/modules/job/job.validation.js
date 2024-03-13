import Joi from "joi"


const addJobValidation = ({
    body: Joi.object({
        jobTitle: Joi.string().trim().lowercase().required(),
        jobLocation: Joi.string().trim().required(),
        workingTime: Joi.string().trim().required(),
        seniorityLevel: Joi.string().trim().required(),
        jobDescription: Joi.string().lowercase().trim().min(20).max(500).required(),
        technicalSkills: Joi.array().items(
            Joi.string().trim().required()
        ).required(),
        softSkills: Joi.array().items(
            Joi.string().trim().required()
        ).required(),
        companyId: Joi.string().hex().max(24).required(),
    })
})

const updateJobValidation = ({
    body: Joi.object({
        jobTitle: Joi.string().trim().lowercase().optional(),
        jobLocation: Joi.string().trim().optional(),
        workingTime: Joi.string().trim().optional(),
        seniorityLevel: Joi.string().trim().optional(),
        jobDescription: Joi.string().lowercase().trim().min(20).max(500).optional(),
        technicalSkills: Joi.array().items(
            Joi.string().trim().required()
        ).optional(),
        softSkills: Joi.array().items(
            Joi.string().trim().required()
        ).optional(),
    }),
    params: Joi.object({
        jobId: Joi.string().hex().max(24).required()
    })
})

const jobParams = ({
    params: Joi.object({
        jobId: Joi.string().hex().max(24).required()
    })
})
const jobQuery = ({
    query: Joi.object({
        companyName: Joi.string().optional(),
        jobTitle: Joi.string().optional(),
        jobLocation: Joi.string().optional(),
        workingTime: Joi.string().optional(),
        seniorityLevel: Joi.string().optional(),
    })
})






export {
    addJobValidation,
    updateJobValidation,
    jobParams,
    jobQuery
}