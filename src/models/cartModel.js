const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
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

    totalCartPrice: {
        type: Number,
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user"
    }
}, {timestamps: true});

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name"
    });

    this.populate({
        path: "cartItems.product",
        select: "title description price"
    });

    next();
});

const CartModel = mongoose.model("cart", cartSchema);

module.exports = CartModel;