import { Router } from "express";

import * as authController from "../auth/auth.controller.js"
import * as userController from "./user.controller.js"
import * as validation from "./user.validation.js"

import { endPointRoles } from "./user.endPoint.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";

const router = Router();

//=================================== update User Data router ===================================// (done)
router.put('/',
    authController.protectedRoute(endPointRoles.USER),
    validationMiddleware(validation.updateUserValidation),
    userController.default.updateUserData
)

//=================================== delete User Account router ===================================// (done)
router.put('/deleteUser/:userId',
    authController.protectedRoute(endPointRoles.ADMIN),
    validationMiddleware(validation.deleteUserValidation),
    userController.default.deleteUserAccount
)

//=================================== Get User Profile Data router ===================================// (done)
router.get('/profileData',
    authController.protectedRoute(endPointRoles.ALL),
    userController.default.getUserProfile
)

//=================================== Get User Profile Data router ===================================// (done)
router.get('/getOneUser/:userId',
    authController.protectedRoute(endPointRoles.ALL),
    userController.default.getOneUser
)

//=================================== Get All User Profile Data router ===================================// (done)
router.get('/allUsers',
    authController.protectedRoute(endPointRoles.ADMIN),
    userController.default.getAllUserProfile
)

//=================================== changePassword router ===================================// (done)
router.put('/changePassword',
    authController.protectedRoute(endPointRoles.ALL),
    validationMiddleware(validation.changePasswordValidation),
    userController.default.changePassword
)

//=================================== Forget Password Router  ===================================// (done)
router.post('/forgetPassword',
    authController.protectedRoute(endPointRoles.ALL),
    validationMiddleware(validation.forgetPasswordValidation),
    userController.default.forgetPassword
)

//=================================== Password Reset router ===================================// (done)
router.get('/reset/password/:token',
    authController.protectedRoute(endPointRoles.ALL),
    validationMiddleware(validation.resetPasswordValidation),
    userController.default.resetPassword
)

//=================================== Get All Deleted User router ===================================// (done)
router.get('/deleted/AllUser',
    authController.protectedRoute(endPointRoles.ADMIN),
    userController.default.getAllDeletedUser
)









export default router;