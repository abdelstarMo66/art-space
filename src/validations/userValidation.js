const {param, body, check} = require("express-validator");
const bcrypt = require("bcrypt")

const ApiError = require("../utils/apiError");
const AuctionModel = require("../models/auctionModel");
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
    body("currentPassword")
        .notEmpty()
        .withMessage("currentPassword must not be empty"),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty")
        .isLength({min: 8})
        .withMessage("password too short, please enter password at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .withMessage("please enter strong password")
        .custom(async (val, {req}) => {
            const {currentPassword, confirmPassword} = req.body;

            const user = await UserModel.findById(req.loggedUser._id);

            const isCorrectPassword = await bcrypt.compare(currentPassword, user.password);

            if (!isCorrectPassword) {
                return Promise.reject(new ApiError("Incorrect Current Password", 400));
            }

            if (val !== confirmPassword) {
                return Promise.reject(new ApiError("Please make sure passwords match", 400));
            }

            return true;
        }),

    body("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword must not be empty"),
];

exports.addUserAddressValidation = [
    body("alias")
        .notEmpty()
        .withMessage("please enter kind of address home/work/..."),

    body("street")
        .notEmpty()
        .withMessage("please enter your street and street number, if any"),

    body("region")
        .notEmpty()
        .withMessage("please enter your region"),

    body("city")
        .notEmpty()
        .withMessage("please enter your city"),

    body("country")
        .notEmpty()
        .withMessage("please enter your country"),

    body("postalCode")
        .optional(),

    body("phone")
        .optional(),
];

exports.registerToAuctionValidation = [
    param("auctionId")
        .isMongoId()
        .withMessage("invalid auction id")
        .custom(async (val) => {
            const product = await AuctionModel.findById(val);

            if (!product) {
                return Promise.reject(new ApiError(`no product found for this id ${val}`, 404));
            }
            return true;
        }),
]