const asyncHandler = require("../middlewares/asyncHandler")
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");
const CartModel = require("../models/cartModel");

const calculateTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach(item => {
        console.log(item)
        totalPrice += item.price;
    });
    cart.totalCartPrice = totalPrice;
}

const addProductToCart = asyncHandler(async (req, res, next) => {
    const {productId} = req.body;

    const product = await ProductModel.findById(productId);
    let cart = await CartModel.findOne({user: req.loggedUser._id});

    if (!cart) {
        cart = await CartModel.create({
            user: req.loggedUser._id,
            cartItems: [{
                product: productId,
                price: product.price
            }]
        });
    } else {
        const productAlreadyInCart = cart.cartItems.find(item => item.product._id.toString() === productId.toString());

        if (productAlreadyInCart) {
            return res.status(400).json(
                apiSuccess(
                    `Product already in cart`,
                    400,
                    null
                ));
        } else {
            cart.cartItems.push({
                product: productId,
                price: product.price
            });
        }
    }

    calculateTotalCartPrice(cart);
    await cart.save();

    return res.status(201).json(
        apiSuccess(
            "Product Add To Cart",
            201,
            null
        ));
});

const getMyCart = asyncHandler(async (req, res, next) => {
    const cart = await CartModel.findOne({user: req.loggedUser._id});

    if (!cart) {
        return next(new ApiError("There is no cart for this user", 404));
    }

    return res.status(200).json(
        apiSuccess(
            `cart Found`,
            200,
            {
                itemCount: cart.cartItems.length,
                cart
            }
        ));
})

const deleteSpecificProductFromCart = asyncHandler(async (req, res, next) => {
    const {itemId} = req.params

    const cart = await CartModel.findOneAndUpdate(
        {user: req.loggedUser._id},
        {$pull: {cartItems: {_id: itemId}}},
        {new: true}
    );

    calculateTotalCartPrice(cart);
    await cart.save();

    return res.status(200).json(
        apiSuccess(
            `cart Found`,
            200,
            {
                itemCount: cart.cartItems.length,
                cart
            }
        ));
})

const clearCart = asyncHandler(async (req, res, next) => {
    await CartModel.findOneAndDelete({user: req.loggedUser._id});

    return res.status(200).json(
        apiSuccess(
            `cart Cleared`,
            200,
            null
        ));
})

module.exports = {
    addProductToCart,
    getMyCart,
    deleteSpecificProductFromCart,
    clearCart,
}