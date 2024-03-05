const express = require('express');

const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadProfileImage,
    uploadToHost,
    changePassword,
    search,
    setProfileID,
    addUserAddress,
    getProfileAddresses,
    removeUserAddress,
    updateProfileImage,
} = require("../controllers/userController")
const {
    getUserValidation,
    updateUserValidation,
    deleteUserValidation,
    changeUserPasswordValidation,
    searchValidation,
    addUserAddressValidation,
} = require("../validations/userValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, allowedToUser, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.get("/getProfile",
    allowedToUser(),
    permissionValidate,
    setProfileID,
    getUser,
);

router.patch("/updateProfile",
    allowedToUser(),
    permissionValidate,
    setProfileID,
    updateUserValidation,
    validationMiddleware,
    updateUser,
);

router.put("/updateImage",
    allowedToUser(),
    permissionValidate,
    setProfileID,
    uploadProfileImage,
    uploadToHost,
    updateProfileImage,
);

router.delete("/deleteProfile",
    allowedToUser(),
    permissionValidate,
    setProfileID,
    deleteUser,
);

router.patch("/changePassword",
    allowedToUser(),
    permissionValidate,
    changeUserPasswordValidation,
    validationMiddleware,
    changePassword,
)

router.route("/address")
    .post(
        allowedToUser(),
        permissionValidate,
        addUserAddressValidation,
        validationMiddleware,
        addUserAddress
    )
    .get(
        allowedToUser(),
        permissionValidate,
        getProfileAddresses,
    )

router.delete("/address/:addressId",
    allowedToUser(),
    permissionValidate,
    removeUserAddress,
)

router.get("/", allowedToAdmins("IT"), permissionValidate, getAllUsers);

router.get("/search", allowedToAdmins("IT"), permissionValidate, searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(allowedToAdmins("IT"), permissionValidate, getUserValidation, validationMiddleware, getUser)
    .patch(allowedToAdmins("IT"), permissionValidate, updateUserValidation, validationMiddleware, updateUser)
    .delete(allowedToAdmins("IT"), permissionValidate, deleteUserValidation, validationMiddleware, deleteUser);

module.exports = router