import Joi from "joi"


const addCompanyValidation = ({
    body: Joi.object({
        companyName: Joi.string().trim().min(2).max(20).lowercase().required(),
        description: Joi.string().trim().min(20).max(300).lowercase().required(),
        industry: Joi.string().required(),
        address: Joi.string().trim().lowercase().required(),
        companyEmail: Joi.string().trim().lowercase().email().required(),
        numberOfEmployees: Joi.number().min(11).max(20).required(),
        // companyHR: Joi.string().trim().lowercase().email().required(),
    })
})

const updateCompanyValidation = ({
    body: Joi.object({
        companyName: Joi.string().trim().min(2).max(20).lowercase().optional(),
        description: Joi.string().trim().min(20).max(300).lowercase().optional(),
        industry: Joi.string().optional(),
        address: Joi.string().trim().lowercase().optional(),
        companyEmail: Joi.string().trim().lowercase().email().optional(),
        numberOfEmployees: Joi.number().min(11).max(20).optional(),
        companyHR: Joi.string().trim().lowercase().email().optional(),
    })
})


const companyParams = ({
    params: Joi.object({
        companyId: Joi.string().hex().max(24).required()
    })
})

const companyQuery = ({
    query: Joi.object({
        companyName: Joi.string()
    })
})





export {
    addCompanyValidation,
    updateCompanyValidation,
    companyParams,
    companyQuery
}