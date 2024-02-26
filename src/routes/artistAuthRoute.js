const express = require('express');

const {
    signup,
    verifyEmail,
    uploadProfileImage,
    uploadToHost,
    login,
    forgotPassword,
    verifyCode,
    resetPassword,
    resendCode,
} = require("../controllers/artistAuthController")
const {
    signupValidator,
    verifyEmailValidator,
    loginValidator,
    emailValidator,
    verifyCodeValidator,
    resetPasswordValidator
} = require("../validations/artistAuthValidation");
const validationMiddleware = require("../middlewares/validationMiddleware")

const router = express.Router();

router.post("/signup",
    uploadProfileImage,
    signupValidator,
    validationMiddleware,
    uploadToHost,
    signup
);

router.post("/verifyEmail",
    verifyEmailValidator,
    validationMiddleware,
    verifyEmail,
)

router.post("/login",
    loginValidator,
    validationMiddleware,
    login,
)

router.post("/forgotPassword",
    emailValidator,
    validationMiddleware,
    forgotPassword,
)

router.post("/verifyCode",
    verifyCodeValidator,
    validationMiddleware,
    verifyCode,
)

router.put("/resetPassword",
    resetPasswordValidator,
    validationMiddleware,
    resetPassword,
)

router.get("/resendCode",
    emailValidator,
    validationMiddleware,
    resendCode,
)

module.exports = router