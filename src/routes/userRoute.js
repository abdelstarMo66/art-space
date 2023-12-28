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
const {allowedToAdmins, allowedToUser} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.get("/getProfile",
    allowedToUser(),
    getUserProfile,
    getUser,
);

router.get("/updateProfile",
    allowedToUser(),
    uploadProfileImage,
    updateProfileValidation,
    validationMiddleware,
    resizeProfileImage,
    updateProfile,
);

router.patch("/changePassword",
    allowedToUser(),
    changeUserPasswordValidation,
    validationMiddleware,
    changePassword,
)

router.get("/",
    allowedToAdmins("IT"),
    getAllUsers,
);

router.get("/search",
    allowedToAdmins("IT"),
    searchValidation,
    validationMiddleware,
    search,
)

router.route("/:id")
    .get(allowedToAdmins("IT"), getUserValidation, validationMiddleware, getUser)
    .patch(allowedToAdmins("IT"), uploadProfileImage, updateUserValidation, validationMiddleware, resizeProfileImage, updateUser)
    .delete(allowedToAdmins("IT"), allowedToUser(), deleteUserValidation, validationMiddleware, deleteUser);


module.exports = router