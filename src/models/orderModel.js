const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "order must belong to user"],
    },

    shippingAddress: {
        type: mongoose.Schema.ObjectId,
        ref: "user.addresses",
        required: [true, "address of order is not available"],
    },

    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "product"
            },
            price: {
                type: Number,
            }
        }
    ],

    totalOrderPrice: Number,

    paymentMethodType: {
        type: String,
        enum: ["cash", "card"],
        default: "cash",
    },

    currency: String,

    isPaid: {
        type: Boolean,
        default: false,
    },

    paidAt: Date,

    orderState: {
        type: String,
        enum: ["Pending", "Confirmed", "Shipped", "Completed", "Canceled", "Refunded"],
        default: "Pending",
    },

    isDelivered: {
        type: Boolean,
        default: false,
    },

    deliveredAt: Date,

}, {timestamps: true});

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name"
    });

    this.populate({
        path: "cartItems.product",
        select: "title description price"
    });

    this.populate({
        path: "shippingAddress",
    });

    next();
});

const OrderModel = mongoose.model("order", orderSchema);

module.exports = OrderModel;