const crypto = require("crypto");

const sharp = require("sharp");
const bcrypt = require("bcrypt");

const asyncHandler = require("../middlewares/asyncHandler");
const generateJWT = require("../utils/generateJWT");
const ApiError = require("../utils/apiError");
const apiSuccess = require("../utils/apiSuccess");
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware");
const sendEmail = require("../utils/sendEmail");
const ArtistModel = require("../models/artistModel");

const uploadProfileImage = uploadSingleImage("profileImg");

const resizeProfileImage = asyncHandler(async (req, res, next) => {
    const fileName = `artist-${Math.round(
        Math.random() * 1e9
    )}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 95})
            .toFile(`uploads/artists/${fileName}`);

        req.body.profileImg = fileName;
    }
    next();
});

const signup = asyncHandler(async (req, res, next) => {
    const artist = await ArtistModel.create(req.body);
    artist.password = await bcrypt.hash(artist.password, 12)
    await artist.save();

    const activateCode = Math.floor(100000 + Math.random() * 900000).toString();

    artist.accountActivateCode = crypto
        .createHash("sha256")
        .update(activateCode)
        .digest("hex");
    artist.AccountActivateExpires = Date.now() + 10 * 60 * 1000;

    const message = `Hi ${artist.name},\nYour verification code is ${activateCode}.\nEnter this code in our [website or app] to activate your [customer portal] account.\nWe’re glad you’re here!\nThe Art Space team\n`;

    try {
        await sendEmail({
            email: artist.email,
            subject: "Activating Your Account (valid for 10 minutes)",
            text: message,
        });
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
    const artist = await ArtistModel.findOne({email: req.body.email});

    const hashedActivateCode = crypto
        .createHash("sha256")
        .update(req.body.activateCode)
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
            {
                token
            },
        ));
})

const forgotPassword = asyncHandler(async (req, res, next) => {
    const artist = await ArtistModel.findOne({email: req.body.email});

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    artist.passwordResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");
    artist.passwordResetExpires = Date.now() + 10 * 60 * 1000; // reset code valid until 10 minutes
    artist.passwordResetVerified = false;

    await artist.save();

    const message = `Hi ${artist.name},\nThere was a request to change your password!\nIf you did not make this request then please ignore this email.\nOtherwise, please enter this code to change your password: ${resetCode}\n`;

    try {
        await sendEmail({
            email: artist.email,
            subject: "Your password Reset Code (valid for 10 minutes)",
            text: message,
        });
    } catch (error) {
        artist.passwordResetCode = undefined;
        artist.passwordResetExpires = undefined;
        artist.passwordResetVerified = undefined;

        await artist.save();
        return next(new ApiError("There is an error in sending email", 500));
    }

    res.status(200).json(apiSuccess("Reset Code sent to email", 200, null));
})

const verifyCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
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

const resendCode = asyncHandler(async (req,res,next)=>{
    const artist = await ArtistModel.findOne({email: req.body.email});

    const activateCode = Math.floor(100000 + Math.random() * 900000).toString();

    artist.accountActivateCode = crypto
        .createHash("sha256")
        .update(activateCode)
        .digest("hex");
    artist.AccountActivateExpires = Date.now() + 10 * 60 * 1000;

    const message = `Hi ${artist.name},\nYour verification code is ${activateCode}.\nEnter this code in our [website or app] to activate your [customer portal] account.\nWe’re glad you’re here!\nThe Art Space team\n`;

    try {
        await sendEmail({
            email: artist.email,
            subject: "Activating Your Account (valid for 10 minutes)",
            text: message,
        });
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
    resizeProfileImage,
    login,
    forgotPassword,
    verifyCode,
    resetPassword,
    resendCode,
}