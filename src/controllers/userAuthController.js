const crypto = require("crypto");

const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const {verificationMessage, resetMessage, resendMessage} = require("../utils/emailMessages");
const generateJWT = require("../utils/generateJWT");
const sendEmail = require("../utils/sendEmail");
const UserModel = require("../models/userModel");

const uploadProfileImage = uploadSingleImage("profileImg", "user");

const uploadToHost = asyncHandler(async (req, res, next) => {
    if(req.file){
        const options = {
            folder: "user",
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
    const user = await UserModel.create(req.body);
    user.password = await bcrypt.hash(user.password, 12)

    const activateCode = Math.floor(1000 + Math.random() * 9000).toString();

    user.accountActivateCode = crypto
        .createHash("sha256")
        .update(activateCode)
        .digest("hex")
    user.AccountActivateExpires = Date.now() + 10 * 60 * 1000;

    const message = verificationMessage(user.name, activateCode);

    try {
        await sendEmail({
            email: user.email,
            subject: "Activating Your Account (valid for 10 minutes)",
            text: message,
        });
    } catch (error) {
        user.accountActivateCode = undefined;
        user.AccountActivateExpires = undefined;

    }

    await user.save();

    return res.status(201).json(
        apiSuccess(
            "signup successfully, verify your email",
            201,
            null,
        ));
});

const verifyEmail = asyncHandler(async (req, res, next) => {
    const {activateCode} = req.body;
    const user = await UserModel.findOne({email: req.body.email});

    const hashedResetCode = crypto
        .createHash("sha256")
        .update(activateCode)
        .digest("hex");

    console.log(user.accountActivateCode)
    console.log(hashedResetCode)

    if (user.accountActivateCode !== hashedResetCode || user.AccountActivateExpires <= Date.now()) {
        return next(new ApiError("activation code invalid or expired"));
    }

    user.accountActive = true;
    user.accountActivateCode = undefined;
    user.AccountActivateExpires = undefined;
    await user.save();

    const token = await generateJWT({id: user._id, role: "user"});

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

    const token = await generateJWT({id: user._id, role: "user"});

    return res.status(200).json(
        apiSuccess(
            `login successfully, welcome ${user.name}`,
            200,
            {token},
        ));
})

const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req.body.email});

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

    user.passwordResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // reset code valid until 10 minutes
    user.passwordResetVerified = false;

    await user.save();

    const message = resetMessage(user.name, resetCode);

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
    const {resetCode} = req.body;

    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
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

    const token = await generateJWT({id: user._id, role: "user"});

    return res.status(200).json(
        apiSuccess(
            `Reset Password Success, welcome ${user.name}`,
            200,
            {
                token
            },
        ));
})

const resendCode = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req.body.email});

    const code = Math.floor(1000 + Math.random() * 9000).toString();

    user.accountActivateCode = crypto
        .createHash("sha256")
        .update(code)
        .digest("hex")
    user.AccountActivateExpires = Date.now() + 10 * 60 * 1000;

    const message = resendMessage(user.name, code);

    try {
        await sendEmail({
            email: user.email,
            subject: "Verification Code (valid for 10 minutes)",
            text: message,
        });
        await user.save();
    } catch (error) {
        user.accountActivateCode = undefined;
        user.AccountActivateExpires = undefined;

        await user.save();
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