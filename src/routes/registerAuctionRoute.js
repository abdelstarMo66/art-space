const express = require('express');

const {
    checkoutSession,
    getRegisterAuctions,
} = require("../controllers/registerAuctionController")
const {
    registerToAuctionValidation,
} = require("../validations/registerAuctionValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToUser, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken ,   allowedToUser(),
    permissionValidate,);

router.get(
    "/checkoutSession/:auctionId",
    registerToAuctionValidation,
    validationMiddleware,
    checkoutSession,
)

router.get("/registerAuctions", getRegisterAuctions)

module.exports = router
