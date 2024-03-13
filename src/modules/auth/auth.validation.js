import Joi from "joi"

const SignUpValidations = {
    body: Joi.object({
        firstName: Joi.string().trim().min(2).max(20).lowercase().required(),
        lastName: Joi.string().trim().min(2).max(20).lowercase().required(),
        email: Joi.string().trim().lowercase().email().required(),
        password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        phonNumbers: Joi.string().regex(/^\+20\d{10}$/).required(),
        DOB: Joi.date().required(),
        role: Joi.string()
    })
}

const SignInValidations = {
    body: Joi.object({
        email: Joi.string().trim().lowercase().email().optional(),
        password: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/),
        phonNumbers: Joi.string().regex(/^\+20\d{10}$/).optional(),

    })
}


export {
    SignUpValidations,
    SignInValidations
}