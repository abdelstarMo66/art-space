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
        .custom((val) =>
            ArtistModel.findOne({email: val}).then((artist) => {
                if (artist) {
                    return Promise.reject(new Error(`this email already use, please enter other email or login`));
                }
            })
        ),

    body("password")
        .notEmpty()
        .withMessage("password must not be empty")
        .isLength({min: 8})
        .withMessage("password too short, please enter password at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .withMessage("please enter strong password")
        .custom((password, {req}) => {
            const {passwordConfirm} = req.body;

            if (password !== passwordConfirm) {
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
        .custom(async (val) => {
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
            if (val.length !== 4) {
                return Promise.reject(
                    new Error(`activate code must be 4 characters long`)
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

exports.emailValidator = [
    body("email")
        .notEmpty()
        .withMessage("email must not be empty")
        .isEmail()
        .withMessage("invalid email address")
        .custom(async (val) => {
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
        .custom(async (val) => {
            const artist = await ArtistModel.findOne({email: val});
            if (!artist) {
                return Promise.reject(
                    new Error(`There are not Email Address Match: ${val}`)
                );
            }
        }),

    body("resetCode")
        .notEmpty()
        .withMessage("Reset Code must not be Empty")
        .custom((val) => {
            if (val.length !== 4) {
                return Promise.reject(
                    new Error(`Reset Code Must be 4 Characters Long`)
                );
            }
            return true;
        }),
];

exports.resetPasswordValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email Must Not be Empty")
        .isEmail()
        .withMessage("Invalid Email Address")
        .custom(async (val) => {
            const artist = await ArtistModel.findOne({email: val});
            if (!artist) {
                return Promise.reject(
                    new Error(`There are not Email Address Match: ${val}`)
                );
            }
        }),

    body("password")
        .notEmpty()
        .withMessage("Password Must Not be Empty")
        .isLength({min: 8})
        .withMessage(
            "Password too Short, Please Enter Password at least 8 Characters"
        )
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .withMessage("Please Enter Strong Password")
        .custom((password, {req}) => {
            const {passwordConfirm} = req.body;
            if (password !== passwordConfirm) {
                return Promise.reject(new Error("Password Confirmation Incorrect"));
            }
            return true;
        }),

    body("passwordConfirm")
        .notEmpty()
        .withMessage("Password Confirmation Required"),
];
