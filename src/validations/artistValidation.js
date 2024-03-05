const {param, body, check} = require("express-validator");
const bcrypt = require("bcrypt")

const ApiError = require("../utils/apiError");
const ArtistModel = require("../models/artistModel");

exports.getArtistValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid artist Id")
        .custom(async (val) => {
            const artist = await ArtistModel.findById(val);

            if (!artist) {
                return Promise.reject(new ApiError(`no artist for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.searchValidation = [
    check("keyword").notEmpty().withMessage("keyword search must be not empty"),
]

exports.updateArtistValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid artist Id")
        .custom(async (val) => {
            const artist = await ArtistModel.findById(val);

            if (!artist) {
                return Promise.reject(new ApiError(`no artist for this id ${val}`, 404));
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
        .withMessage("please enter invalid phone"),
];

exports.deleteArtistValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid artist Id")
        .custom(async (val) => {
            const artist = await ArtistModel.findById(val);

            if (!artist) {
                return Promise.reject(new ApiError(`no artist for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.changeArtistPasswordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage("currentPassword must not be empty"),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty")
        .custom(async (val, {req}) => {
            const {currentPassword, confirmPassword} = req.body;

            const artist = await ArtistModel.findById(req.loggedUser._id);

            const isCorrectPassword = await bcrypt.compare(currentPassword, artist.password);

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

exports.addArtistAddressValidation = [
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