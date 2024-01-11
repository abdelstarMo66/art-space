const asyncHandler = require("./asyncHandler");
const ApiError = require("../utils/apiError");
const AdminModel = require("../models/adminModel");
const UserModel = require("../models/userModel");
const ArtistModel = require("../models/artistModel");


// exports.allowedToUser = () =>
//     asyncHandler(async (req, res, next) => {
//         const user = await UserModel.findById(req.loggedUser._id);
//
//         if (!user) {
//             return next(new ApiError("You are not allowed access this route", 403));
//         }
//         next();
//     });
//
// exports.allowedToArtist = () =>
//     asyncHandler(async (req, res, next) => {
//         const artist = await ArtistModel.findById(req.loggedUser._id);
//
//         if (!artist) {
//             return next(new ApiError("You are not allowed access this route", 403));
//         }
//         next();
//     });
//
// exports.allowedToAdmins = (...roles) =>
//     asyncHandler(async (req, res, next) => {
//         const admin = await AdminModel.findById(req.loggedUser._id);
//
//         if (!admin || !roles.includes(admin.role)) {
//             return next(new ApiError("You are not allowed access this route", 403));
//         }
//         next();
//     });

exports.allowedToUser = () => asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.loggedUser._id);

    if (!user) {
        req.allowError = true;
    }
    req.allowSuccess = true;
    next();
});

exports.allowedToArtist = () => asyncHandler(async (req, res, next) => {
    const artist = await ArtistModel.findById(req.loggedUser._id);

    if (!artist) {
        req.allowError = true;
    }
    req.allowSuccess = true;
    next();
});

exports.allowedToAdmins = (...roles) => asyncHandler(async (req, res, next) => {
    const admin = await AdminModel.findById(req.loggedUser._id);

    if (!admin || !roles.includes(admin.role)) {
        req.allowError = true;
    }
    req.allowSuccess = true;
    next();
});

exports.permissionValidate = (req, res, next) => {
    if (req.allowSuccess) {
        next();
    } else if (req.allowError) {
        return next(new ApiError("You are not allowed access this route", 403));
    } else {
        next();
    }
}