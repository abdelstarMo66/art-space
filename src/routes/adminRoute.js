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
} = require("../controllers/adminController");
const {
    createAdminValidation,
    getAdminValidation,
    updateAdminValidation,
    deleteAdminValidation,
    searchValidation,
    loginValidator
} = require("../validations/adminValidation");
const validationMiddleware = require("../middlewares/validationMiddleware")
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.post("/login", loginValidator, validationMiddleware, login)

router.get("/getProfile",
    verifyToken,
    allowedToAdmins("IT", "Tracker", "CEO"),
    permissionValidate,
    setProfileID,
    getAdmin,
);

router.use(verifyToken, allowedToAdmins("CEO"), permissionValidate);

router.route("/")
    .get(getAdmins)
    .post(uploadProfileImage, createAdminValidation, validationMiddleware,uploadToHost, createAdmin);

router.get("/search", searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(getAdminValidation, validationMiddleware, getAdmin)
    .patch(updateAdminValidation, validationMiddleware, updateAdmin)
    .delete(deleteAdminValidation, validationMiddleware, deleteAdmin);

router.put("/updateImgProfile/:id",uploadProfileImage, uploadToHost , updateImgProfile)

module.exports = router;