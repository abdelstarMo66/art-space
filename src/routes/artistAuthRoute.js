const express = require('express');

const {
    signup,
    verifyEmail,
    uploadProfileImage,
    resizeProfileImage,
    login,
    forgotPassword,
    verifyCode,
    resetPassword
} = require("../controllers/artistAuthController")
const {
    signupValidator,
    verifyEmailValidator,
    loginValidator,
    forgotPasswordValidator,
    verifyCodeValidator,
    resetPasswordValidator
} = require("../validations/artistAuthValidation");
const validationMiddleware = require("../middlewares/validationMiddleware")

const router = express.Router();

router.post("/signup",
    uploadProfileImage,
    signupValidator,
    validationMiddleware,
    resizeProfileImage,
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
    forgotPasswordValidator,
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

module.exports = router