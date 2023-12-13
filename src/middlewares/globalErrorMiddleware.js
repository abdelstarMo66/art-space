const ApiError = require("../utils/apiError");

const globalError = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorForDev(error,req, res,next);
    } else {
        if (error.name === "JsonWebTokenError") error = handelJWTInvalidSignature();
        if (error.name === "TokenExpiredError") error = handelJWTExpired();
        sendErrorForProd(error,req, res,next);
    }
};

const handelJWTInvalidSignature = () =>
    new ApiError("Invalid token, please login again", 401);

const handelJWTExpired = () =>
    new ApiError("Expired Token, please login again", 401);

const sendErrorForDev = (error,req, res,next) =>
    res.status(error.statusCode).json({
        status: error.status,
        code: error.statusCode,
        message: error.message,
        error: error,
        stack: error.stack,
    });

const sendErrorForProd = (error,req, res,next) =>
    res.status(error.statusCode).json({
        status: error.status,
        code: error.statusCode,
        message: error.message,
    });

module.exports = globalError;