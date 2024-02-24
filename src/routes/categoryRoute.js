const express = require("express");

const {
    createCategory,
    getCategories,
    getCategory,
    search,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const {
    createCategoryValidation,
    getCategoryValidation,
    searchValidation,
    updateCategoryValidation,
    deleteCategoryValidation
} = require("../validations/categoryValidation")
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins,allowedToArtist, allowedToUser, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken, allowedToAdmins("CEO"));

router.route("/")
    .get(allowedToUser(),allowedToArtist(), permissionValidate, getCategories)
    .post(permissionValidate, createCategoryValidation, validationMiddleware, createCategory)

router.get("/search", permissionValidate, searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(permissionValidate, getCategoryValidation, validationMiddleware, getCategory)
    .patch(permissionValidate, updateCategoryValidation, validationMiddleware, updateCategory)
    .delete(permissionValidate, deleteCategoryValidation, validationMiddleware, deleteCategory)

module.exports = router;