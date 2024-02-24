const express = require("express");

const {
    createStyle,
    getStyles,
    getStyle,
    search,
    updateStyle,
    deleteStyle,
} = require("../controllers/styleController");
const {
    createStyleValidation,
    getStyleValidation,
    searchValidation,
    updateStyleValidation,
    deleteStyleValidation
} = require("../validations/styleValidation")
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, allowedToUser, permissionValidate, allowedToArtist} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken, allowedToAdmins("CEO"));

router.route("/")
    .get(allowedToUser(), allowedToArtist(), permissionValidate, getStyles)
    .post(permissionValidate, createStyleValidation, validationMiddleware, createStyle)

router.get("/search", permissionValidate, searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(permissionValidate, getStyleValidation, validationMiddleware, getStyle)
    .patch(permissionValidate, updateStyleValidation, validationMiddleware, updateStyle)
    .delete(permissionValidate, deleteStyleValidation, validationMiddleware, deleteStyle)

module.exports = router;