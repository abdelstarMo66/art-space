const crypto = require("crypto");

const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const generateJWT = require("../utils/generateJWT");
const sendEmail = require("../utils/sendEmail");
const ArtistModel = require("../models/artistModel");

const uploadProfileImage = uploadSingleImage("profileImg", "artist");

const uploadToHost = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const options = {
            folder: "artist",
            public_id: req.file.filename,
            use_filename: true,
            resource_type: "image",
            format: "jpg",
        };

        req.body.profileImg = await cloudinary.uploader.upload(req.file.path, options);
    }
    next();
});

const signup = asyncHandler(async (req, res) => {
    const artist = await ArtistModel.create(req.body);
    artist.password = await bcrypt.hash(artist.password, 12)

    const activateCode = Math.floor(1000 + Math.random() * 9000).toString();

    artist.accountActivateCode = crypto
        .createHash("sha256")
        .update(activateCode)
        .digest("hex");
    artist.AccountActivateExpires = Date.now() + 10 * 60 * 1000;

    try {
        await sendEmail({
            email: artist.email,
            subject: "Reset Your Email (valid for 10 minutes)",
        },{code: activateCode});
    } catch (error) {
        artist.accountActivateCode = undefined;
        artist.AccountActivateExpires = undefined;
    }

    await artist.save();

    return res.status(201).json(
        apiSuccess(
            "signup successfully, verify your email",
            201,
            null,
        ));
});

const verifyEmail = asyncHandler(async (req, res, next) => {
    const {activateCode} = req.body;
    const artist = await ArtistModel.findOne({email: req.body.email});

    const hashedActivateCode = crypto
        .createHash("sha256")
        .update(activateCode)
        .digest("hex");

    if (artist.accountActivateCode !== hashedActivateCode || artist.AccountActivateExpires <= Date.now()) {
        return next(new ApiError("activation code invalid or expired"));
    }

    artist.accountActive = true;
    artist.accountActivateCode = undefined;
    artist.AccountActivateExpires = undefined;

    await artist.save();

    const token = await generateJWT({id: artist._id, role: "artist"});

    return res.status(200).json(apiSuccess("email verification successful", 200, {token}));
})

const login = asyncHandler(async (req, res, next) => {
    const artist = await ArtistModel.findOne({email: req.body.email});

    if (!artist) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, artist.password);

    if (!isPasswordCorrect) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    const token = await generateJWT({id: artist._id, role: "artist"});

    return res.status(200).json(
        apiSuccess(
            `login successfully, welcome ${artist.name}`,
            200,
            {token},
        ));
})

const forgotPassword = asyncHandler(async (req, res, next) => {
    const artist = await ArtistModel.findOne({email: req.body.email});

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    artist.passwordResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");
    artist.passwordResetExpires = Date.now() + 10 * 60 * 1000; // reset code valid until 10 minutes
    artist.passwordResetVerified = false;

    await artist.save();

    try {
        await sendEmail({
            email: artist.email,
            subject: "Reset Your password (valid for 10 minutes)",
        }, {code: resetCode});
    } catch (error) {
        artist.passwordResetCode = undefined;
        artist.passwordResetExpires = undefined;
        artist.passwordResetVerified = undefined;

        await artist.save();
        console.log(error);
        return next(new ApiError("There is an error in sending email", 500));
    }

    res.status(200).json(apiSuccess("Reset Code sent to email", 200, null));
})

const verifyCode = asyncHandler(async (req, res, next) => {
    const {resetCode} = req.body;
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");

    const artist = await ArtistModel.findOne({email: req.body.email})

    if (artist.passwordResetCode !== hashedResetCode || artist.passwordResetExpires <= Date.now()) {
        return next(new ApiError("reset code invalid or expired"));
    }

    artist.passwordResetVerified = true;
    await artist.save();

    return res.status(200).json(apiSuccess("code verification successful", 200, null));
})

const resetPassword = asyncHandler(async (req, res, next) => {
    const artist = await ArtistModel.findOne({email: req.body.email});

    if (!artist.passwordResetVerified) {
        return next("Reset code not verified", 400);
    }

    artist.password = await bcrypt.hash(req.body.password, 12);
    artist.passwordResetCode = undefined;
    artist.passwordResetExpires = undefined;
    artist.passwordResetVerified = undefined;

    await artist.save();

    const token = await generateJWT({id: artist._id, role: "artist"});

    return res.status(200).json(
        apiSuccess(
            `Reset Password Success, welcome ${artist.name}`,
            200,
            {
                token
            },
        ));
})

const resendCode = asyncHandler(async (req, res, next) => {
    const artist = await ArtistModel.findOne({email: req.body.email});

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    artist.accountActivateCode = crypto
        .createHash("sha256")
        .update(code)
        .digest("hex");

    artist.AccountActivateExpires = Date.now() + 10 * 60 * 1000;

    try {
        await sendEmail({
            email: artist.email,
            subject: "get code again (valid for 10 minutes)",
        },{code: code});
        await artist.save();
    } catch (error) {
        artist.accountActivateCode = undefined;
        artist.AccountActivateExpires = undefined;

        await artist.save();
        return next(new ApiError("There is an error in sending email", 500));
    }

    return res.status(200).json(
        apiSuccess(
            "check your email",
            200,
            null,
        ));
})

module.exports = {
    signup,
    verifyEmail,
    uploadProfileImage,
    uploadToHost,
    login,
    forgotPassword,
    verifyCode,
    resetPassword,
    resendCode,
}