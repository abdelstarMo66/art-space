const express = require("express");

const {
    uploadProductImages,
    uploadToHost,
    addProductToActions,
    removeProductFromActions,
    updateProductFromSpecificAuction,
    getAuctions,
    getMeAuction,
    getProductOfAuction,
    updatePrice,
    changeSpecificImage,
    changeCoverImage,
} = require("../controllers/auctionController");
const {
    addProductToAuctionValidation,
    updateProductFromAuctionValidation,
    deleteProductFromAuctionValidation,
    updateFinalPriceValidation
} = require("../validations/auctionValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToArtist, permissionValidate, allowedToUser, allowedToAdmins} = require("../middlewares/allowTo");

const router = express.Router();

// router.use(verifyToken);

router.get("/me",
    allowedToArtist(),
    permissionValidate,
    getMeAuction,
    getAuctions,
);

router.route("/")
    .get(
        // allowedToUser(),
        // allowedToAdmins("IT"),
        // permissionValidate,
        getAuctions,
    )
    .post(
        allowedToArtist(),
        permissionValidate,
        uploadProductImages,
        uploadToHost,
        addProductToAuctionValidation,
        validationMiddleware,
        addProductToActions
    )

router.route("/product/:productId")
    .get(
        allowedToUser(),
        allowedToArtist(),
        allowedToAdmins("IT"),
        permissionValidate,
        getProductOfAuction,
    )
    .patch(
        allowedToArtist(),
        permissionValidate,
        updateProductFromAuctionValidation,
        validationMiddleware,
        updateProductFromSpecificAuction,
    )
    .delete(
        allowedToArtist(),
        permissionValidate,
        deleteProductFromAuctionValidation,
        validationMiddleware,
        removeProductFromActions,
    )

router.put("/changeCoverImage/:productId", uploadProductImages, uploadToHost, changeCoverImage);

router.put("/changeSpecificImage/:productId", uploadProductImages, uploadToHost, changeSpecificImage);

router.patch("/:productId/updatePrice",
    allowedToUser(),
    permissionValidate,
    updateFinalPriceValidation,
    validationMiddleware,
    updatePrice,
);

module.exports = router