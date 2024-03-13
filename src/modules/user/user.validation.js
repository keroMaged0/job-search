import Joi from "joi"


const updateUserValidation = ({
    body: Joi.object({
        firstName: Joi.string().trim().min(2).max(20).lowercase().optional(),
        lastName: Joi.string().trim().min(2).max(20).lowercase().optional(),
        email: Joi.string().trim().lowercase().email().optional(),
        phonNumbers: Joi.string().regex(/^\+20\d{10}$/).optional(),
        DOB: Joi.date().optional(),
    })
})

const changePasswordValidation = ({
    body: Joi.object({
        oldPassword: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
        newPassword: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    })
})


const deleteUserValidation = ({
    params: Joi.object({
        userId: Joi.string().hex().max(24).required()
    })
})

const forgetPasswordValidation = ({
    body: Joi.object({
        email: Joi.string().trim().lowercase().email().required(),
    })
})

const resetPasswordValidation = Joi.object({
    body: Joi.object({
        newPassword: Joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/).required(),
    }).required(),
    params: Joi.object({
        token: Joi.string().required(),
    }),
})


export {
    updateUserValidation,
    changePasswordValidation,
    deleteUserValidation,
    forgetPasswordValidation,
    resetPasswordValidation
}