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
} = require("../controllers/userController")
const {
    getUserValidation,
    updateUserValidation,
    deleteUserValidation,
    changeUserPasswordValidation,
    searchValidation
} = require("../validations/userValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");

const router = express.Router();

router.route("/").get(getAllUsers);

router.route("/search")
    .get(searchValidation, validationMiddleware, search,)

router.route("/:id")
    .get(getUserValidation, validationMiddleware, getUser)
    .patch(uploadProfileImage, updateUserValidation, validationMiddleware, resizeProfileImage, updateUser)
    .delete(deleteUserValidation, validationMiddleware, deleteUser);

router.route("/:id/changePassword")
    .patch(changeUserPasswordValidation, validationMiddleware, changePassword)



module.exports = router