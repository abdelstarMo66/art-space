const {param} = require("express-validator");

const ApiError = require("../utils/apiError");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");

exports.createOrderValidation = [
    param("cartId")
        .isMongoId()
        .withMessage("invalid cart id")
        .custom(async (val) => {
            const cart = await CartModel.findById(val);

            if (!cart) {
                return Promise.reject(new ApiError(`no cart found for this id ${val}`, 404));
            }
            return true;
        }),
]

exports.findOrderValidation = [
    param("orderId")
        .isMongoId()
        .withMessage("invalid order id")
        .custom(async (val) => {
            const order = await OrderModel.findById(val);

            if (!order) {
                return Promise.reject(new ApiError(`no order found for this id ${val}`, 404));
            }
            return true;
        }),
]