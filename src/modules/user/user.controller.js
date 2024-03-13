import userModel from "../../../DB/models/user.model.js";
import * as userModelCheck from "./utils/find_users.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { catchError } from "../../middleware/global-response.middleware.js";
import { sendEmail } from "../../service/Email/sendEmail.js";
import { appError } from "../../utils/app.Error.js";

//=================================== update User Profile Data controller ===================================//  (done)
/*
    * destruct required data
    * check what do update 
    * check unique email and
    * check unique phone number
    * save new data in database
*/
const updateUserData = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { firstName, lastName, email, phonNumbers, DOB } = req.body

        // get  user profile
        const user = await userModel.findById(_id)
        if (!user) return next(new appError('!not found user', 401))

        // if update name 
        if (firstName) user.firstName = firstName
        if (lastName) user.lastName = lastName


        // get all users
        let users = userModelCheck.findAllUser()

        // if update email 
        if (email) {

            // check unique email
            users.map(user => {
                if (user.email.toString() == email) return next(new appError('email already used please change and try again ', 404))
            })

            user.email = email
        }

        // if update phone number
        if (phonNumbers) {
            // check unique phone number and email
            users.map(user => {
                // check phone number
                if (user.phonNumbers.toString() == phonNumbers) return next(new appError('phonNumbers already used please change and try again ', 404))
            })
            user.phonNumbers = phonNumbers
        }

        // if update DOB
        if (DOB) user.DOB = DOB

        await user.save()

        res.json({ success: true, message: "User profile updated successfully", data: user })
    }
)

//=================================== Delete User Account soft delete controller ===================================// (done)
/*
    * destruct data to params  
    * check if user and soft delete
*/
const deleteUserAccount = catchError(
    async (req, res, next) => {
        // destruct data to params 
        const { userId } = req.params

        // find user by id and soft delete 
        const deletedUser = await userModel.findByIdAndUpdate(
            { _id: userId, loggedIn: true },
            { isDeleted: true },
            { new: true }
        )
        if (!deletedUser) return next(new appError("User not found", 404))

        res.json({ success: true, message: "User account deleted successfully" })
    }
)


//=================================== Get User Profile Data controller ===================================//  (done)
/* 
    * destruct required data
    * find user model
    * return error if user is not found
    * return success and date  if user 
*/
const getUserProfile = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user

        // find user model
        let userData = await userModel.findOne({ _id: _id, loggedIn: true })
        if (!userData) return next(new appError('!not found user', 401))

        res.json({ success: true, message: "User profile found successfully", data: userData })
    }
)

//=================================== Get profile data for another user controller ===================================//  (done)
/* 
    * destruct required data
    * find user model
    * return error if user is not found
    * return success and date  if user 
*/
const getOneUser = catchError(
    async (req, res, next) => {
        // destruct required data
        const { userId } = req.params

        // find user model
        let userData = await userModel.findById({ _id: userId })
        if (!userData) return next(new appError('!not found user', 401))

        res.json({ success: true, message: "User profile found successfully", data: userData })
    }
)

//=================================== Get All User Profile Data controller ===================================//  (done)
/* 
    * find user model
    * return error if user is not found
    * return success and date  if user 
*/
const getAllUserProfile = catchError(
    async (req, res, next) => {
        // find user model
        let userData = await userModelCheck.findAllUser()
        if (!userData) return next(new appError('!not found user', 401))

        res.json({ success: true, message: "User profile found successfully", data: userData })
    }
)


//=================================== changePassword controller ===================================// (done)
/* 
    * destruct required data  
    * find if found user
    * check if password valid
    * create token
*/
const changePassword = catchError(
    async (req, res, next) => {
        // destruct required data
        const { oldPassword, newPassword } = req.body
        const { _id } = req.user

        //  check if auth user
        let user = await userModelCheck.findUser(_id)

        // if !not found user
        if (!user) return next(new appError('!not found user', 401))

        // if found id and password in body match password in user token
        if (user && bcrypt.compareSync(oldPassword, user.password, +process.env.SALT_ROUND)) {
            // create new token  
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.CHANGE_PASSWORD_SIGNATURE)

            // find user by id and update old password to new password 
            await userModel.findByIdAndUpdate(user._id, { password: newPassword, changePasswordTime: Date.now() })

            return res.json({ success: true, message: "password change successfully", data: token })
        }

        return res.json({ success: false, message: "!not valid old password please try again" })


    }
)


//=================================== Forget Password And Reset Controller ===================================// (done) 
/*
    * destruct required data
    * check if user auth
    * check if email send body match email user  
*/
const forgetPassword = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { email } = req.body

        // check if user found
        let user = await userModelCheck.findUser(_id)
        if (!user) return next(new appError('!not found user', 401))

        // check if email send body match email user 
        if (toString(user.email) !== toString(email)) return next(new appError('not found email please try agin', 404))

        // send email
        sendEmail( email,  'forgetPassword')

        res.json({ success: true, message: "password reset link sent to your email" })
    }
)

//=================================== Reset Password Controller ===================================// (done)
/*
    * destruct data from query
    * decode token
    * find by email
    * find user and update 
*/
const resetPassword = catchError(
    async (req, res, next) => {
        // destruct data from query
        const { token } = req.params
        const { newPassword } = req.body

        if (!newPassword) return next(new appError('please add newPassword in body',))

        // decode token and check
        jwt.verify(token, process.env.JWT_SECRET_LOGIN, async (err, decoded) => {

            if (err) return next(new appError(err, 400))

            // find user model and update
            let user = await userModel.findOneAndUpdate({
                email: decoded.email
            }, {
                resetPassword: true,
                password: newPassword

            }, { new: true })

            res.json({ success: true, message: "done update password now" })
        })


    }
)


//=================================== Get All Deleted User controller ===================================// (done)
/* 
        * find user isDeleted 
*/
const getAllDeletedUser = catchError(
    async (req, res, next) => {

        // find user isDeleted 
        const deletedUser = await userModel.find({ isDeleted: true })
        if (!deletedUser) return next(new appError("User not found", 404))

        res.json({ success: true, message: "successfully", data: deletedUser })
    }
)

export default {
    updateUserData,
    deleteUserAccount,
    getUserProfile,
    getOneUser,
    getAllUserProfile,
    changePassword,
    forgetPassword,
    resetPassword,
    getAllDeletedUser,
}