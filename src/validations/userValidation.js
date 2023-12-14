const {param, body} = require("express-validator");

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