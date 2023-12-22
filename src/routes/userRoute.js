const express = require('express');

const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadProfileImage,
    resizeProfileImage,
    changePassword,
    search,
    getUserProfile,
    updateProfile,
} = require("../controllers/userController")
const {
    getUserValidation,
    updateUserValidation,
    deleteUserValidation,
    changeUserPasswordValidation,
    searchValidation,
    updateProfileValidation,
} = require("../validations/userValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");


const router = express.Router();

router.use(verifyToken);

router.get("/getProfile", getUserProfile, getUser);

router.get("/updateProfile",
    uploadProfileImage,
    updateProfileValidation,
    validationMiddleware,
    resizeProfileImage,
    updateProfile,
);

router.get("/", getAllUsers);

router.get("/search", searchValidation, validationMiddleware, search,)

router.route("/:id")
    .get(getUserValidation, validationMiddleware, getUser)
    .patch(uploadProfileImage, updateUserValidation, validationMiddleware, resizeProfileImage, updateUser)
    .delete(deleteUserValidation, validationMiddleware, deleteUser);

router.patch("/changePassword",
    changeUserPasswordValidation,
    validationMiddleware,
    changePassword,
)

module.exports = router