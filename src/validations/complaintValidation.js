const {body, param} = require("express-validator");
const ApiError = require("../utils/apiError");

exports.createComplaintValidation = [
    body("message")
        .notEmpty()
        .withMessage("message of complaint is required")
        .isLength({max: 500})
        .withMessage("too long message of this complaint"),
];