const express = require("express");

const {
    createCashOrder,
    getOrders,
    getMyOrders,
    getOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderState,
    checkoutSession,
} = require("../controllers/orderController");
const {
    createOrderValidation,
    findOrderValidation,
} = require("../validations/orderValidation")
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToUser, permissionValidate, allowedToAdmins} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.get("/me", allowedToUser, permissionValidate, getMyOrders)

router.post(
    "/cash/:cartId",
    allowedToUser(),
    permissionValidate,
    createOrderValidation,
    validationMiddleware,
    createCashOrder,
)

router.get(
    "/checkoutSession/:cartId",
    allowedToUser(),
    permissionValidate,
    createOrderValidation,
    validationMiddleware,
    checkoutSession,
)

router.get(
    "/:cartId",
    allowedToUser(),
    allowedToAdmins("Tracker"),
    permissionValidate,
    findOrderValidation,
    validationMiddleware,
    getOrder,
);

router.get("/", allowedToAdmins("Tracker"), permissionValidate, getOrders)

router.patch("/:orderId/paid",
    allowedToAdmins("Tracker"),
    permissionValidate,
    findOrderValidation,
    validationMiddleware,
    updateOrderToPaid
);

router.patch("/:orderId/delivered",
    allowedToAdmins("Tracker"),
    permissionValidate,
    findOrderValidation,
    validationMiddleware,
    updateOrderToDelivered
);

router.patch("/:orderId/state",
    allowedToAdmins("Tracker"),
    permissionValidate,
    findOrderValidation,
    validationMiddleware,
    updateOrderState
);

module.exports = router;
