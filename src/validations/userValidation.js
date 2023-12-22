const {param, body, check} = require("express-validator");
const bcrypt = require("bcrypt")

const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");

exports.getUserValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const user = await UserModel.findById(val);

            if (!user) {
                return Promise.reject(new ApiError(`no user for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.searchValidation = [
    check("keyword").notEmpty().withMessage("keyword search must be not empty"),
]

exports.updateUserValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const user = await UserModel.findById(val);

            if (!user) {
                return Promise.reject(new ApiError(`no user for this id ${val}`, 404));
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

    body("phone")
        .optional()
        .matches(/^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage("please enter invalid phone")
];

exports.deleteUserValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const user = await UserModel.findById(val);

            if (!user) {
                return Promise.reject(new ApiError(`no user for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.changeUserPasswordValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const user = await UserModel.findById(val);

            if (!user) {
                return Promise.reject(new ApiError(`no user for this id ${val}`, 404));
            }
            return true;
        }),

    body("currentPassword")
        .notEmpty()
        .withMessage("currentPassword must not be empty"),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword must not be empty"),

    body("password")
        .custom(async (val, {req}) => {
            const user = await UserModel.findById(req.params.id);

            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );

            if (!isCorrectPassword) {
                return Promise.reject(new ApiError("Incorrect Current Password", 400));
            }

            if (val !== req.body.confirmPassword) {
                return Promise.reject(new ApiError("Please make sure passwords match", 400));
            }

            return true;
        }),
];

exports.updateProfileValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const user = await UserModel.findById(val);

            if (!user) {
                return Promise.reject(new ApiError(`no user for this id ${val}`, 404));
            }
            return true;
        }),

    body("name")
        .optional()
        .isLength({min: 3})
        .withMessage("name too short"),

    body("phone")
        .optional()
        .matches(/^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage("please enter invalid phone")
];