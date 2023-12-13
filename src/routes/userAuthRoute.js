const express = require('express');

const {signup, uploadProfileImage, resizeProfileImage} = require("../controllers/userAuthController")
const {signupValidator} = require("../validations/userAuthValidation");
const validationMiddleware = require("../middlewares/validationMiddleware")

const router = express.Router();

router.route("/signup").post(
    uploadProfileImage,
    signupValidator,
    validationMiddleware,
    resizeProfileImage,
    signup
);

router.route("/login").post()

module.exports = router