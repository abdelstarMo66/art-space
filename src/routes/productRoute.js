const express = require("express");

const {
    createProduct,
    getProducts,
    getProduct,
    search,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    uploadToHost,
    getMeProducts,
    changeSpecificImage,
    changeCoverImage,
    deleteSpecificImage,
} = require("../controllers/productController");
const {
    createProductValidation,
    getProductValidation,
    searchValidation,
    updateProductValidation,
    deleteProductValidation,
    getMeProductValidation,
    updateMeProductValidation,
    deleteMeProductValidation,
    meProductValidation,
} = require("../validations/productValidation")
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, allowedToUser, allowedToArtist, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.route("/")
    .get(
        allowedToUser(),
        allowedToAdmins("IT"),
        permissionValidate,
        getProducts,
    )
    .post(
        allowedToArtist(),
        permissionValidate,
        uploadProductImages,
        uploadToHost,
        createProductValidation,
        validationMiddleware,
        createProduct,
    )

router.get("/me", allowedToArtist(), permissionValidate, getMeProducts, getProducts)

router.route("/:id")
    .get(
        allowedToUser(),
        allowedToAdmins("IT"),
        permissionValidate,
        getProductValidation,
        validationMiddleware,
        getProduct,
    )
    .patch(
        allowedToAdmins("IT"),
        permissionValidate,
        updateProductValidation,
        validationMiddleware,
        updateProduct,
    )
    .delete(
        allowedToAdmins("IT"),
        permissionValidate,
        deleteProductValidation,
        validationMiddleware,
        deleteProduct,
    )

router.route("/me/:id")
    .get(
        allowedToArtist(),
        permissionValidate,
        getMeProductValidation,
        validationMiddleware,
        getProduct,
    )
    .patch(
        allowedToArtist(),
        permissionValidate,
        updateMeProductValidation,
        validationMiddleware,
        updateProduct,
    )
    .delete(
        allowedToArtist(),
        permissionValidate,
        deleteMeProductValidation,
        validationMiddleware,
        deleteProduct,
    )

router.get("/search",
    allowedToAdmins("IT"),
    permissionValidate,
    searchValidation,
    validationMiddleware,
    search,
)

router.put("/changeCoverImage/:productId", meProductValidation, validationMiddleware, uploadProductImages, uploadToHost, changeCoverImage)

router.put("/changeSpecificImage/:productId", meProductValidation, validationMiddleware, uploadProductImages, uploadToHost, changeSpecificImage)

router.delete("/deleteSpecificImage/:productId", meProductValidation, validationMiddleware, deleteSpecificImage)

module.exports = router;