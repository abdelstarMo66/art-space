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
const {allowedToAdmins, allowedToUser} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken, allowedToAdmins("CEO"));

router.route("/")
    .get(allowedToUser(), getCategories)
    .post(createCategoryValidation, validationMiddleware, createCategory)

router.get("/search", searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(allowedToUser(), getCategoryValidation, validationMiddleware, getCategory)
    .patch(updateCategoryValidation, validationMiddleware, updateCategory)
    .delete(deleteCategoryValidation, validationMiddleware, deleteCategory)

module.exports = router;