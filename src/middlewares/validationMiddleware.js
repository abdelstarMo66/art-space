const {validationResult} = require("express-validator");

const ApiError = require("../utils/apiError");

const validatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new ApiError(errors.array()[0].msg, 400));
    }
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    next();
};

module.exports = validatorMiddleware;
