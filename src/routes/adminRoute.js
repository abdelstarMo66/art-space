const express = require("express");

const {
    createAdmin,
    getAdmins,
    getAdmin,
    updateAdmin,
    deleteAdmin,
    search,
    login
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
const {allowedToAdmins} = require("../middlewares/allowTo");

const router = express.Router();

router.post("/login", loginValidator, validationMiddleware, login)

router.use(verifyToken, allowedToAdmins("CEO"));

router.route("/")
    .get(getAdmins)
    .post(createAdminValidation, validationMiddleware, createAdmin);

router.get("/search", searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(getAdminValidation, validationMiddleware, getAdmin)
    .patch(updateAdminValidation, validationMiddleware, updateAdmin)
    .delete(deleteAdminValidation, validationMiddleware, deleteAdmin);

module.exports = router;