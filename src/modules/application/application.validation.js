import Joi from "joi"

//=================================== apply to job validation ===================================// (done)
const applyToJobValidation = ({
    body: Joi.object({
        userTechSkills: Joi.array().items(
            Joi.string()
        ).required(),
        userSoftSkills: Joi.array().items(
            Joi.string()
        ).required(),
    }).required(),
    params: Joi.object({
        jobId: Joi.string().hex().max(24).required()
    }).required(),

})

//=================================== delete One Application Validation ===================================// (done)
const deleteOneApplicationValidation = ({
    params: Joi.object({
        applicationId: Joi.string().hex().max(24).required()
    }).required(),
})

//=================================== get all Application on job Validation ===================================// (done)
const getAllApplicationOneJobValidation = ({
    params: Joi.object({
        jobId: Joi.string().hex().max(24).required()
    }).required(),
})



export {
    applyToJobValidation,
    deleteOneApplicationValidation,
    getAllApplicationOneJobValidation
}