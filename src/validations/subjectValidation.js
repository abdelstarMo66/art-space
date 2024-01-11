const {param, body, check} = require("express-validator");
const slugify = require("slugify")

const ApiError = require("../utils/apiError");
const SubjectModel = require("../models/subjectModel");

exports.createSubjectValidation = [
    body("title")
        .notEmpty()
        .withMessage("title of subject is required")
        .isLength({min: 3})
        .withMessage("Too short subject name")
        .isLength({max: 32})
        .withMessage("Too long subject name")
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
];

exports.getSubjectValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Subject Id")
        .custom(async (val) => {
            const subject = await SubjectModel.findById(val);

            if (!subject) {
                return Promise.reject(new ApiError(`no subject for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.updateSubjectValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Subject Id")
        .custom(async (val) => {
            const subject = await SubjectModel.findById(val);

            if (!subject) {
                return Promise.reject(new ApiError(`no subject for this id ${val}`, 404));
            }
            return true;
        }),

    body("title")
        .optional()
        .isLength({min: 3})
        .withMessage("Too short subject name")
        .isLength({max: 32})
        .withMessage("Too long subject name")
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
];

exports.deleteSubjectValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Subject Id")
        .custom(async (val) => {
            const subject = await SubjectModel.findById(val);

            if (!subject) {
                return Promise.reject(new ApiError(`no subject for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.searchValidation = [
    check("keyword").notEmpty().withMessage("keyword search must be not empty"),
];