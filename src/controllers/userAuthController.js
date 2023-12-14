const sharp = require("sharp");
const bcrypt = require("bcrypt");

const asyncHandler = require("../middlewares/asyncHandler");
const generateJWT = require("../utils/generateJWT");
const ApiError = require("../utils/apiError");
const apiSuccess = require("../utils/apiSuccess");
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware");
const UserModel = require("../models/userModel");

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

    const token = await generateJWT({userId: user._id});

    return res.status(201).json(
        apiSuccess(
            "signup successfully, verify your email",
            201,
            {
                token
            },
        ));
});

const login = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({email: req.body.email});

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!user || !isPasswordCorrect) {
        return next(new ApiError("Incorrect email or password", 401));
    }

    const token = await generateJWT({userId: user._id});

    return res.status(201).json(
        apiSuccess(
            `login successfully, welcome ${user.name}`,
            201,
            {
                token
            },
        ));
})

module.exports = {
    signup,
    uploadProfileImage,
    resizeProfileImage,
    login,
}