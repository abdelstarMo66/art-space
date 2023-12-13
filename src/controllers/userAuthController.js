const sharp = require("sharp");

const asyncHandler = require("../middlewares/asyncHandler");
const generateJWT = require("../utils/generateJWT");
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

        req.body.image = fileName;
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

module.exports = {
    signup,
    uploadProfileImage,
    resizeProfileImage,
}