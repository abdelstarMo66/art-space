const express = require("express");

const {
    createAdmin,
    uploadProfileImage,
    uploadToHost,
    getAdmins,
    getAdmin,
    updateAdmin,
    updateImgProfile,
    deleteAdmin,
    search,
    login,
    setProfileID,
    changePassword,
    updateProfile,
} = require("../controllers/adminController");
const {
    createAdminValidation,
    getAdminValidation,
    updateAdminValidation,
    deleteAdminValidation,
    searchValidation,
    loginValidator,
    changeAdminPasswordValidation,
} = require("../validations/adminValidation");
const validationMiddleware = require("../middlewares/validationMiddleware")
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.post("/login", loginValidator, validationMiddleware, login)

router.get("/getProfile", verifyToken, allowedToAdmins("IT", "Tracker", "CEO"), permissionValidate, setProfileID, getAdmin);

router.patch("/updateProfile", verifyToken, allowedToAdmins("IT", "Tracker", "CEO"), permissionValidate, setProfileID, updateProfile)

router.delete("/deleteProfile", verifyToken, allowedToAdmins("IT", "Tracker", "CEO"), permissionValidate, setProfileID, deleteAdmin);

router.put("/updateImgProfile", verifyToken, allowedToAdmins("IT", "Tracker", "CEO"), permissionValidate, setProfileID, uploadProfileImage, uploadToHost, updateImgProfile)

router.patch("/changePassword", verifyToken, allowedToAdmins("IT", "Tracker", "CEO"), permissionValidate, changeAdminPasswordValidation, validationMiddleware, changePassword)

router.use(verifyToken, allowedToAdmins("CEO"), permissionValidate);

router.route("/")
    .get(getAdmins)
    .post(uploadProfileImage, uploadToHost, createAdminValidation, validationMiddleware, createAdmin);

router.get("/search", searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(getAdminValidation, validationMiddleware, getAdmin)
    .patch(updateAdminValidation, validationMiddleware, updateAdmin)
    .delete(deleteAdminValidation, validationMiddleware, deleteAdmin);

router.put("/updateImgProfile/:id", uploadProfileImage, uploadToHost, updateImgProfile)

module.exports = router;