const {param, body, check} = require("express-validator");
const bcrypt = require("bcrypt")

const ApiError = require("../utils/apiError");
const AdminModel = require("../models/adminModel");

exports.getAdminValidation = [
    param("id")
    .isMongoId()
    .withMessage("Invalid User Id")
    .custom(async (val) => {
        const admin = await AdminModel.findById(val);

        if (!admin) {
            return Promise.reject(new ApiError(`no admin for this id ${val}`, 404));
        }
        return true;
    }),
];

exports.createAdminValidation = [body("nId")
    .notEmpty()
    .withMessage("national ID must not be empty")
    .custom(async (val, req) => {
        const admin = await AdminModel.findOne({nId: val});

        if (admin) {
            return Promise.reject(new ApiError("nId already in use", 400));
        }

        return true;
    }),

    body("name")
        .notEmpty()
        .withMessage("name must not be empty")
        .isLength({min: 3})
        .withMessage("name too short"),

    body("username")
        .notEmpty()
        .withMessage("username must not be empty")
        .isLength({min: 6})
        .withMessage("username too short")
        .custom(async (val, req) => {
            const admin = await AdminModel.findOne({username: val});

            if (admin) {
                return Promise.reject(new ApiError("username already in use", 400));
            }

            return true;
        }),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty")
        .isLength({min: 8})
        .withMessage("password too short, please enter password at least 8 characters")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage("please enter strong password")
        .custom((password, {req}) => {
            if (password !== req.body.passwordConfirm) {
                return Promise.reject(new Error("password confirmation incorrect"))
            }
            return true;
        }),


    body("passwordConfirm").notEmpty()
        .withMessage("password confirmation required"),

    body("phone")
        .notEmpty()
        .withMessage("phone must not be empty")
        .matches(/^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage("please enter invalid phone")
        .custom(async (val, req) => {
            const admin = await AdminModel.findOne({phone: val});

            if (admin) {
                return Promise.reject(new ApiError("phone already in use", 400));
            }

            return true;
        }),

    body("gender")
        .optional()
        .isIn(["male", "female"])
        .withMessage("gender must be male or female"),

    body("role")
        .notEmpty()
        .withMessage("role must be IT or Tracker")
        .isIn(["IT", "Tracker"])
        .withMessage("role must be IT or Tracker"),
];

exports.updateAdminValidation = [param("id")
    .isMongoId()
    .withMessage("Invalid User Id")
    .custom(async (val) => {
        const admin = await AdminModel.findById(val);

        if (!admin) {
            return Promise.reject(new ApiError(`no admin for this id ${val}`, 404));
        }
        return true;
    }),

    body("name")
        .optional()
        .isLength({min: 3})
        .withMessage("name too short"),

    body("gender")
        .optional()
        .isIn(["male", "female"])
        .withMessage("gender must be male or female"),

    body("role")
        .optional()
        .isIn(["CEO", "IT", "Tracker"])
        .withMessage("role must be one of the following (CEO, IT and Tracker)"),

    body("phone")
        .optional()
        .matches(/^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage("please enter invalid phone"),


    body("password")
        .optional()
        .isLength({min: 8})
        .withMessage("password too short, please enter password at least 8 characters")
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage("please enter strong password"),

];

exports.deleteAdminValidation = [param("id")
    .isMongoId()
    .withMessage("Invalid User Id")
    .custom(async (val) => {
        const admin = await AdminModel.findById(val);

        if (!admin) {
            return Promise.reject(new ApiError(`no admin for this id ${val}`, 404));
        }
        return true;
    }),];

exports.searchValidation = [
    check("keyword").notEmpty().withMessage("keyword search must be not empty"),
]

exports.loginValidator = [
    body("username")
        .notEmpty()
        .withMessage("username must not be empty"),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty")
        .isLength({min: 8})
        .withMessage("password too short, please enter password at least 8 characters"),
]