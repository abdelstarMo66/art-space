const crypto = require("crypto");

const sharp = require("sharp");
const bcrypt = require("bcrypt");

const asyncHandler = require("../middlewares/asyncHandler");
const generateJWT = require("../utils/generateJWT");
const ApiError = require("../utils/apiError");
const apiSuccess = require("../utils/apiSuccess");
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware");
const UserModel = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const uploadProfileImage = uploadSingleImage("profileImg");

const resizeProfileImage = asyncHandler(async (req, res, next) => {
    const fileName = `user-${Math.round(
        Math.random() * 1e9
    )}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 95})
            .toFile(`uploads/users/${fileName}`);

        req.body.profileImg = fileName;
    }
    next();
});

const signup = asyncHandler(async (req, res, next) => {
    const user = await UserModel.create(req.body);
    user.password = await bcrypt.hash(user.password, 12)
    await user.save();

    const activateCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.accountActivateCode = crypto
        .createHash("sha256")
        .update(activateCode)
        .digest("hex");
    user.AccountActivateExpires = Date.now() + 10 * 60 * 1000;

    const message = `Hi ${user.name},\nYour verification code is ${activateCode}.\nEnter this code in our [website or app] to activate your [customer portal] account.\nWe’re glad you’re here!\nThe Art Space team\n`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Activating Your Account (valid for 10 minutes)",
            text: message,
        });
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(new ApiError("There is an error in sending email", 500));
    }

    return res.status(201).json(
        apiSuccess(
            "signup successfully, verify your email",
            201,
            null,
        ));
});

const verifyEmail = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req.body.email});

    const hashedActivateCode = crypto
        .createHash("sha256")
        .update(req.body.activateCode)
        .digest("hex");

    if (user.accountActivateCode === hashedActivateCode && user.AccountActivateExpires <= Date.now()) {
        return next(new ApiError("activation code invalid or expired"));
    }

    user.accountActive = true;
    await user.save();

    const token = await generateJWT({id: user._id,role: "user"});

    return res.status(200).json(apiSuccess("email verification successful", 200, {token}));
})

const login = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req.body.email});

    if (!user) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordCorrect) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    const token = await generateJWT({id: user._id,role: "user"});

    return res.status(200).json(
        apiSuccess(
            `login successfully, welcome ${user.name}`,
            200,
            {
                token
            },
        ));
})

const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req.body.email});

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.passwordResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // reset code valid until 10 minutes
    user.passwordResetVerified = false;

    await user.save();

    const message = `Hi ${user.name},\nThere was a request to change your password!\nIf you did not make this request then please ignore this email.\nOtherwise, please enter this code to change your password: ${resetCode}\n`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Your password Reset Code (valid for 10 minutes)",
            text: message,
        });
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();
        return next(new ApiError("There is an error in sending email", 500));
    }

    res.status(200).json(apiSuccess("Reset Code sent to email", 200, null));
})

const verifyCode = asyncHandler(async (req, res, next) => {
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex");

    const user = await UserModel.findOne({email: req.body.email})

    if (user.passwordResetCode !== hashedResetCode || user.passwordResetExpires <= Date.now()) {
        return next(new ApiError("reset code invalid or expired"));
    }

    user.passwordResetVerified = true;
    await user.save();

    return res.status(200).json(apiSuccess("code verification successful", 200, null));
})

const resetPassword = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req.body.email});

    if (!user.passwordResetVerified) {
        return next("Reset code not verified", 400);
    }

    user.password = await bcrypt.hash(req.body.password, 12);
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    const token = await generateJWT({id: user._id,role: "user"});

    return res.status(200).json(
        apiSuccess(
            `Reset Password Success, welcome ${user.name}`,
            200,
            {
                token
            },
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
}