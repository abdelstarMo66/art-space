const jwt = require("jsonwebtoken")

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const AdminModel = require("../models/adminModel");
const ArtistModel = require("../models/artistModel");

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

    if (decoded.role === "admin") {
        const currentUser = await AdminModel.findById(decoded.id);

        if (!currentUser) {
            return next(
                new ApiError("the admin belong to this token does not longer exist", 401)
            );
        }
        
        req.loggedUser = currentUser;
        next();
    } else {
        const currentUser = await UserModel.findById(decoded.id) || await ArtistModel.findById(decoded.id);

        if (!currentUser) {
            return next(
                new ApiError("the user belong to this token does not longer exist", 401)
            );
        }

        if (!currentUser.accountActive) {
            return next(
                new ApiError("this account is not verified, please verify this email ang go back", 400)
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

        req.loggedUser = currentUser;
        next();
    }

});

module.exports = verifyToken;