// to catch error
process.on('uncaughtException', ((err) =>
    console.log('error', err)
))

import { globalResponse } from "./middleware/global-response.middleware.js"
import { rollbackDocumentMiddleware } from "./middleware/rollback-documents.middleware.js"
import { rollbackMiddleware } from "./middleware/rollback-upload-file.middleware copy.js"
import * as routers from "./modules/index.routes.js"
import { appError } from "./utils/app.Error.js"

export const initiateApp = (app, express) => {



    app.use(express.json())

    // router api
    app.use('/jobSearch/user', routers.userRouter)
    app.use('/jobSearch/auth', routers.authRouter)
    app.use('/jobSearch/company', routers.companyRouter)
    app.use('/jobSearch/job', routers.jobRouter)
    app.use('/jobSearch/application', routers.applicationRouter)

    // !not found end point
    app.use('*', (req, res, next) => {
        next(new appError(`not found end point: ${req.originalUrl}`, 404))
        res.json({ message: "message not found " })
    })
    
    // global Error
    app.use(globalResponse, rollbackMiddleware, rollbackDocumentMiddleware)
    
    // to catch error
    process.on('unhandledRejection', (err =>
        console.log('error', err)
    ))

}