const {body} = require("express-validator");

const ArtistModel = require("../models/artistModel");

exports.signupValidator = [
    body("name")
        .notEmpty()
        .withMessage("name must not be empty")
        .isLength({min: 3})
        .withMessage("name too short"),

    body("email")
        .notEmpty()
        .withMessage("email must not be empty")
        .isEmail()
        .withMessage("invalid email address")
        .custom((val, {req}) =>
            ArtistModel.findOne({email: val}).then((artist) => {
                if (artist) {
                    return Promise.reject(
                        new Error(
                            `this email already use, please enter other email or login`
                        )
                    );
                }
            })
        ),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty")
        .isLength({min: 8})
        .withMessage(
            "password too short, please enter password at least 8 characters"
        )
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage("please enter strong password")
        .custom((password, {req}) => {
            if (password !== req.body.passwordConfirm) {
                return Promise.reject(new Error("password confirmation incorrect"));
            }
            return true;
        }),

    body("passwordConfirm")
        .notEmpty()
        .withMessage("password confirmation required"),

    body("phone")
        .notEmpty()
        .withMessage("phone must not be empty")
        .matches(/^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage("please enter invalid phone"),
];

exports.verifyEmailValidator = [
    body("email")
        .notEmpty()
        .withMessage("email must not be empty")
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (val, {req}) => {
            const artist = await ArtistModel.findOne({email: val});
            if (!artist) {
                return Promise.reject(
                    new Error(`There are not email address match: ${val}`)
                );
            }
        }),

    body("activateCode")
        .notEmpty()
        .withMessage("activateCode must not be empty")
        .custom((val) => {
            if (val.length !== 6) {
                return Promise.reject(
                    new Error(`activate code must be 6 characters long`)
                );
            }
            return true;
        }),
];

exports.loginValidator = [
    body("email")
        .notEmpty()
        .withMessage("email must not be empty")
        .isEmail()
        .withMessage("invalid email address"),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty")
        .isLength({min: 8})
        .withMessage(
            "password too short, please enter password at least 8 characters"
        ),
];

exports.forgotPasswordValidator = [
    body("email")
        .notEmpty()
        .withMessage("email must not be empty")
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (val, {req}) => {
            const artist = await ArtistModel.findOne({email: val});
            if (!artist) {
                return Promise.reject(
                    new Error(`There are not email address match: ${val}`)
                );
            }
        }),
];

exports.verifyCodeValidator = [
    body("email")
        .notEmpty()
        .withMessage("email must not be empty")
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (val, {req}) => {
            const artist = await ArtistModel.findOne({email: val});
            if (!artist) {
                return Promise.reject(
                    new Error(`There are not email address match: ${val}`)
                );
            }
        }),

    body("resetCode")
        .notEmpty()
        .withMessage("resetCode must not be empty")
        .custom((val) => {
            if (val.length !== 6) {
                return Promise.reject(
                    new Error(`reset code must be 6 characters long`)
                );
            }
            return true;
        }),
];

exports.resetPasswordValidator = [
    body("email")
        .notEmpty()
        .withMessage("email must not be empty")
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (val, {req}) => {
            const artist = await ArtistModel.findOne({email: val});
            if (!artist) {
                return Promise.reject(
                    new Error(`There are not email address match: ${val}`)
                );
            }
        }),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty")
        .isLength({min: 8})
        .withMessage(
            "password too short, please enter password at least 8 characters"
        )
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
        .withMessage("please enter strong password")
        .custom((password, {req}) => {
            if (password !== req.body.passwordConfirm) {
                return Promise.reject(new Error("password confirmation incorrect"));
            }
            return true;
        }),

    body("passwordConfirm")
        .notEmpty()
        .withMessage("password confirmation required"),
];