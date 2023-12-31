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
const {allowedToAdmins, allowedToUser, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.get("/getProfile",
    allowedToUser(),
    permissionValidate,
    getUserProfile,
    getUser,
);

router.patch("/updateProfile",
    allowedToUser(),
    permissionValidate,
    uploadProfileImage,
    updateProfileValidation,
    validationMiddleware,
    resizeProfileImage,
    updateProfile,
);

router.patch("/changePassword",
    allowedToUser(),
    permissionValidate,
    changeUserPasswordValidation,
    validationMiddleware,
    changePassword,
)

router.get("/",
    allowedToAdmins("IT"),
    permissionValidate,
    getAllUsers,
);

router.get("/search",
    allowedToAdmins("IT"),
    permissionValidate,
    searchValidation,
    validationMiddleware,
    search,
)

router.route("/:id")
    .get(allowedToAdmins("IT"), permissionValidate, getUserValidation, validationMiddleware, getUser)
    .patch(allowedToAdmins("IT"), permissionValidate, uploadProfileImage, updateUserValidation, validationMiddleware, resizeProfileImage, updateUser)
    .delete(allowedToAdmins("IT"), allowedToUser(), permissionValidate, deleteUserValidation, validationMiddleware, deleteUser);


module.exports = router