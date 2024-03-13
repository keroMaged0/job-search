import { Router } from "express";

import * as authController from "../auth/auth.controller.js"
import * as companyController from "./company.controller.js"
import * as validation from "./company.validation.js"

import { endPointRoles } from "./company.endPoint.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";

const router = Router();

//=================================== add User Data router ===================================//
router.post('/',
    authController.protectedRoute(endPointRoles.C_HR),
    validationMiddleware(validation.addCompanyValidation),
    companyController.addCompany
)

//=================================== update company Data router ===================================//
router.put('/',
    authController.protectedRoute(endPointRoles.C_HR),
    validationMiddleware(validation.updateCompanyValidation),
    companyController.updateCompany
)

//=================================== delete company Data router ===================================//
router.put('/:companyId',
    authController.protectedRoute(endPointRoles.C_HR),
    validationMiddleware(validation.updateCompanyValidation),
    companyController.deleteCompany
)

//=================================== get data company Data router ===================================//
router.get('/:companyId',
    authController.protectedRoute(endPointRoles.C_HR),
    validationMiddleware(validation.companyParams),
    companyController.getDataCompany
)

//=================================== search company Data router ===================================//
router.get('/',
    authController.protectedRoute(endPointRoles.USER_C_HR),
    validationMiddleware(validation.companyQuery),
    companyController.searchCompany
)


export default router;