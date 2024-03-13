import { Router } from "express";

import * as authController from "../auth/auth.controller.js"
import * as jobController from "./job.controller.js"
import * as validation from "./job.validation.js"

import { endPointRoles } from "./job.endPoint.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";

const router = Router();

//=================================== add User Data router ===================================// (done)
router.post('/addJob',
    authController.protectedRoute(endPointRoles.C_HR),
    validationMiddleware(validation.addJobValidation),
    jobController.addJob
)

//=================================== update job Data router ===================================// (done)
router.put('/:jobId',
    authController.protectedRoute(endPointRoles.C_HR),
    validationMiddleware(validation.updateJobValidation),
    jobController.updateJob
)

//=================================== delete company Data router ===================================// (done)
router.delete('/:jobId',
    authController.protectedRoute(endPointRoles.C_HR),
    validationMiddleware(validation.jobParams),
    jobController.deleteJob
)

//=================================== Get all Jobs for a specific company router ===================================// (done)
router.get('/',
    authController.protectedRoute(endPointRoles.USER_C_HR),
    validationMiddleware(validation.jobQuery),
    jobController.GetAllJobOneCompany
)

//=================================== Get all Jobs for  company's router ===================================// (done)
router.get('/allJobs',
    authController.protectedRoute(endPointRoles.USER_C_HR),
    jobController.GetAllJobsCompany
)

//=================================== search job by filter router ===================================// (done)
router.get('/search/jobs',
    authController.protectedRoute(endPointRoles.USER_C_HR),
    validationMiddleware(validation.jobQuery),
    jobController.searchJob
)



export default router;