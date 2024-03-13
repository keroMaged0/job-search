

import multer from "multer"
import generateUniqueString from "../utils/generate-Unique-String.js";
import { allowedExtensions } from "../utils/allowed-extensions.js";

import fs from 'fs' // built in module for handling file system
import path from 'path' // built in module for handling path


export const multerMiddleHost = ({
    extensions = allowedExtensions.image,
}) => {


    // diskStorage
    const storage = multer.diskStorage({
        filename: (req, file, cb) => {
            const uniqueFileName = generateUniqueString(6) + '_' + file.originalname
            cb(null, uniqueFileName)
        }
    })

    // file Filter
    const fileFilter = (req, file, cb) => {
        if (extensions.includes(file.mimetype.split('/')[1])) {
            return cb(null, true)
        }
        cb(new Error('Image format is not allowed!'), false)
    }


    const upload = multer({ fileFilter, storage })
    return upload
}
