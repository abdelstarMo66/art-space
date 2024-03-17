const {param, body, check} = require("express-validator");

const ApiError = require("../utils/apiError");
const AdminModel = require("../models/adminModel");
const bcrypt = require("bcrypt");

exports.getAdminValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const admin = await AdminModel.findById(val);

            if (!admin) {
                return Promise.reject(new ApiError(`No Admin For This Id ${val}`, 404));
            }
            return true;
        }),
];

exports.createAdminValidation = [
    body("nId")
        .notEmpty()
        .withMessage("National ID Must Not be Empty")
        .custom(async (val) => {
            const admin = await AdminModel.findOne({nId: val});

            if (admin) {
                return Promise.reject(new ApiError("National ID Already in Use", 400));
            }

            return true;
        }),

    body("name")
        .notEmpty()
        .withMessage("Name Must Not be Empty")
        .isLength({min: 3})
        .withMessage("Name Too Short"),

    body("username")
        .notEmpty()
        .withMessage("Username Must Not be Empty")
        .isLength({min: 6})
        .withMessage("Username too Short")
        .custom(async (val) => {
            const admin = await AdminModel.findOne({username: val});

            if (admin) {
                return Promise.reject(new ApiError("Username Already in Use", 400));
            }

            return true;
        }),

    body("password")
        .notEmpty()
        .withMessage("Password Must Not be Empty")
        .isLength({min: 8})
        .withMessage("Password too Short, Please Enter Password at least 8 Characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .withMessage("Please Enter Strong Password")
        .custom((password, {req}) => {
            const {passwordConfirm} = req.body

            if (password !== passwordConfirm) {
                return Promise.reject(new Error("Password Confirmation Incorrect"));
            }
            return true;
        }),


    body("passwordConfirm").notEmpty()
        .withMessage("Password Confirmation Required"),

    body("phone")
        .notEmpty()
        .withMessage("Phone Must Not be Empty")
        .matches(/^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage("Please Enter Invalid Phone")
        .custom(async (val) => {
            const admin = await AdminModel.findOne({phone: val});

            if (admin) {
                return Promise.reject(new ApiError("Phone Already in Use", 400));
            }

            return true;
        }),

    body("gender")
        .optional()
        .isIn(["male", "female"])
        .withMessage("Gender Must be Male or Female"),

    body("role")
        .notEmpty()
        .withMessage("Role Must be IT or Tracker")
        .isIn(["IT", "Tracker"])
        .withMessage("Role Must be IT or Tracker"),
];

exports.updateAdminValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const admin = await AdminModel.findById(val);

            if (!admin) {
                return Promise.reject(new ApiError(`No Admin For this Id ${val}`, 404));
            }
            return true;
        }),

    body("name")
        .optional()
        .isLength({min: 3})
        .withMessage("Name too Short"),

    body("gender")
        .optional()
        .isIn(["male", "female"])
        .withMessage("Gender Must be Male or Female"),

    body("role")
        .optional()
        .isIn(["IT", "Tracker"])
        .withMessage("Role Must be One of the Following (IT and Tracker)"),

    body("phone")
        .optional()
        .matches(/^\+?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage("Please Enter Invalid Phone"),

    body("password")
        .optional()
        .isLength({min: 8})
        .withMessage("Password too Short, Please Enter Password at least 8 Characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/, "i")
        .withMessage("Please Enter Strong Password"),

];

exports.deleteAdminValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid User Id")
        .custom(async (val) => {
            const admin = await AdminModel.findById(val);

            if (!admin) {
                return Promise.reject(new ApiError(`No Admin For this Id ${val}`, 404));
            }
            return true;
        }),
];

exports.searchValidation = [
    check("keyword").notEmpty().withMessage("Keyword Search Must be Not Empty"),
];

exports.loginValidator = [
    body("username")
        .notEmpty()
        .withMessage("Username Must Not be Empty"),

    body("password")
        .notEmpty()
        .withMessage("Password Must Not be Empty")
        .isLength({min: 8})
        .withMessage("Password too Short, Please Enter Password at least 8 Characters"),
];

exports.changeAdminPasswordValidation = [
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

            const admin = await AdminModel.findById(req.loggedUser._id);

            const isCorrectPassword = await bcrypt.compare(currentPassword, admin.password);

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