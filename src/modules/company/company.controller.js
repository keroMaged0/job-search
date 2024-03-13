import companyModel from "../../../DB/models/company.model.js"
import userModel from "../../../DB/models/user.model.js"
import { catchError } from "../../middleware/global-response.middleware.js"
import { apiFeature } from "../../service/api_feature.js"

import { appError } from "../../utils/app.Error.js"

//=================================== add company controller ===================================// (done)
/* 
    * destruct data from body
    * check if companyName or companyEmail exists
    * check if companyHr exists
    * create company object
    * create company and save in db
*/
const addCompany = catchError(
    async (req, res, next) => {
        // destruct data from body
        const { _id } = req.user
        const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body

        // check if companyName or companyEmail exists 
        let existCompany = await companyModel.findOne({ companyName: companyName, companyEmail: companyEmail })
        if (existCompany) return next(new appError('company already exists', 404))

        // check if companyHr exists
        let companyHr = await userModel.findById(_id)
        if (!companyHr) return next(new appError('companyHr not found', 404))

        // create company object
        let companyObj = {
            companyName,
            description,
            industry,
            address,
            numberOfEmployees,
            companyEmail,
            companyHR: _id
        }

        // save company in db
        let company = companyModel(companyObj)
        await company.save()

        res.json({ success: true, message: "Company saved successfully", data: company })
    }
)
//=================================== Update company data controller ===================================// (done)
/* 
    * destruct data from body
    * check if companyName or companyEmail exists
    * if update company name
    * if update company description
    * if update company industry
    * if update company address
    * if update company numberOfEmployees
    * if update company companyEmail
    * if update company hr
    
*/
const updateCompany = catchError(
    async (req, res, next) => {
        // destruct data from body
        const { _id } = req.user
        const { companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR } = req.body

        console.log(_id);
        // check if companyName or companyEmail exists 
        let existCompany = await companyModel.findOne({ companyHR: _id })
        if (!existCompany) return next(new appError('company not found', 404))

        console.log(existCompany);

        // if update company name 
        if (companyName) existCompany.companyName = companyName;

        // if update company description
        if (description) existCompany.description = description;

        // if update company industry
        if (industry) existCompany.industry = industry;

        // if update company address
        if (address) existCompany.address = address;

        // if update company numberOfEmployees
        if (numberOfEmployees) existCompany.numberOfEmployees = numberOfEmployees;

        // if update company companyEmail
        if (companyEmail) {
            // check unique  email
            const existsEmail = await companyModel.findOne({ companyEmail: companyEmail })
            if (existsEmail) return next(new appError('email already exist', 404))

            existCompany.companyEmail = companyEmail
        }

        // if update company companyHR
        if (companyHR) {
            // check user
            const user = await userModel.findOne({ _id: companyHR, role: 'Company_HR' })
            if (!user) return next(new appError('user not found', 404))

            existCompany.companyHR = companyHR
        }

        // save new data
        await existCompany.save()

        res.json({ success: true, message: "Company saved successfully", data: existCompany })
    }
)
//=================================== Delete company data ===================================// (done)
/*
    * destruct required data
    * find company by id
    * check if owner 
    * soft delete company
*/
const deleteCompany = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { companyId } = req.params

        // find company by id
        let company = await companyModel.findOne({ _id: companyId, isDeleted: false })
        if (!company) return next(new appError('company not found', 404))

        // soft delete company
        company.isDeleted = true
        await company.save()

        res.json({ success: true, message: "Company deleted successfully", data: company })

    }
)
//=================================== Get company data  ===================================// (done)
/*
    * destruct required data
    * find company by id
    * check if owner 
    * soft delete company
*/
const getDataCompany = catchError(
    async (req, res, next) => {
        // destruct required data
        const { _id } = req.user
        const { companyId } = req.params

        // find company by id
        let company = await companyModel.findOne({ _id: companyId, isDeleted: false })
        if (!company) return next(new appError('company not found', 404))

        res.json({ success: true, message: "successfully", data: company })

    }
)
//=================================== Search for a company with a name ===================================// (done)
/* 
    * destruct required data
    * find company by name apiFeature
*/
const searchCompany = catchError(
    async (req, res, next) => {
        // destruct required data
        const { page, size, sort, ...query } = req.query;

        // find company by name apiFeature
        const ApiFeature = new apiFeature(req.query, companyModel.find())
            .pagination()
            .sort()
            .search(query)
            .filter(query);

        const company = await ApiFeature.mongooseQuery

        if (!company) return next(new appError('company not found', 404))

        res.json({ success: true, message: "successfully", data: company })

    }
)

export {
    addCompany,
    updateCompany,
    deleteCompany,
    getDataCompany,
    searchCompany
}