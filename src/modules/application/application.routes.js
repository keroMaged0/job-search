import { Router } from "express";

import * as authController from "../auth/auth.controller.js"
import * as applicationController from "./application.controller.js"
import * as validation from "./application.validation.js"

import { endPointRoles } from "./application.endPoint.js";
import { validationMiddleware } from "../../middleware/validation.middleware.js";
import { multerMiddleHost } from "../../middleware/multer.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";

const router = Router();

//=================================== apply to job application router ===================================// (done)
router.post('/applyToJob/:jobId',
    authController.protectedRoute(endPointRoles.USER),
    multerMiddleHost({ extensions: allowedExtensions.document }).single('CV'),
    validationMiddleware(validation.applyToJobValidation),
    applicationController.applyToJob
)

//=================================== delete One Application router ===================================// (done)
router.delete('/deleteApplication/:applicationId',
    authController.protectedRoute(endPointRoles.USER),
    validationMiddleware(validation.deleteOneApplicationValidation),
    applicationController.deleteOneApplication
)

//=================================== get all Application on job router ===================================// (done)
router.get('/allApplicationOneJob/:jobId',
    authController.protectedRoute(endPointRoles.C_HR),
    validationMiddleware(validation.getAllApplicationOneJobValidation),
    applicationController.getAllApplicationOneJob
)


export default router;