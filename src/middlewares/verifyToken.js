const jwt = require("jsonwebtoken")

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");

const verifyToken = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ApiError("You are not login, please login to get access this route", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const currentUser = await UserModel.findById(decoded.userId);

    if (!currentUser) {
        return next(
            new ApiError("the user belong to this token does not longer exist", 401)
        );
    }

    if (currentUser.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        );

        // password changed after token created
        if (passwordChangedTimeStamp > decoded.iat) {
            return next(
                new ApiError(
                    "User recently changed his password, please login again...",
                    401
                )
            );
        }
    }

    req.user = currentUser;
    next();

});

module.exports = verifyToken;