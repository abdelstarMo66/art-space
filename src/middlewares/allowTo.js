const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/apiError");
const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");


exports.allowedToUser = () =>
    asyncHandler(async (req, res, next) => {
        const user = await UserModel.findById(req.loggedUser._id);

        if (!user) {
            return next(new ApiError("You are not allowed access this route", 403));
        }
        next();
    });

exports.allowedToArtist = () =>
    asyncHandler(async (req, res, next) => {
        if (req.loggedUser.role !== "artist") {
            return next(new ApiError("You are not allowed access this route", 403));
        }
        next();
    });

exports.allowedToAdmins = (...roles) =>
    asyncHandler(async (req, res, next) => {
        const admin = await AdminModel.findById(req.loggedUser._id);

        if (!admin || !roles.includes(admin.role)) {
            return next(new ApiError("You are not allowed access this route", 403));
        }
        next();
    });
