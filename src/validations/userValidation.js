const {param} = require("express-validator");

exports.getUserValidation = [
    param("id").isMongoId().withMessage("Invalid User Id"),
];

exports.updateUserValidation = [
    param("id").isMongoId().withMessage("Invalid User Id"),
];

exports.deleteUserValidation = [
    param("id").isMongoId().withMessage("Invalid User Id"),
];