const express = require('express');

const {
    signup,
    uploadProfileImage,
    resizeProfileImage,
    login
} = require("../controllers/userAuthController")
const {
    signupValidator,
    loginValidator,
} = require("../validations/userAuthValidation");
const validationMiddleware = require("../middlewares/validationMiddleware")

const router = express.Router();

router.route("/signup").post(
    uploadProfileImage,
    signupValidator,
    validationMiddleware,
    resizeProfileImage,
    signup
);

router.route("/login").post(
    loginValidator,
    validationMiddleware,
    login,
)

module.exports = router