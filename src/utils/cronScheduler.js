const schedule = require('node-schedule');

const asyncHandler = require("../middlewares/asyncHandler");
const EventModel = require("../models/eventModel");
const ProductModel = require("../models/productModel");
const AuctionModel = require("../models/auctionModel");
const CartModel = require("../models/cartModel");

const eventJob = () => {
    schedule.scheduleJob('0 0 0 * * *', async () => {
        const events = await EventModel.find();

        for (const event of events) {
            const began = new Date(event.began);
            const end = new Date(event.end);

            // Launch Event
            if (began >= Date.now()) {
                event.isLaunch = true;
                await event.save();
            }

            // End Event
            if (end >= Date.now()) {
                event.isLaunch = false;
                await event.save();

                // Change product in this event to inEvent = false
                for (const oneProduct of event.products) {
                    const product = await ProductModel.findById(oneProduct);
                    product.inEvent = false;
                    await product.save();
                }
            }
        }

    });
}

const calculateTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach(item => {
        console.log(item)
        totalPrice += item.price;
    });
    cart.totalCartPrice = totalPrice;
}

const addProductToCart = asyncHandler(async (product) => {
    let cart = await CartModel.findOne({user: product.finalUser});

    if (!cart) {
        cart = await CartModel.create({
            user: product.finalUser,
            cartItems: [{
                product: product._id,
                price: product.finalPrice
            }]
        });
    } else {
        cart.cartItems.push({
            product: product._id,
            price: product.finalPrice
        });
    }

    calculateTotalCartPrice(cart);
    await cart.save();
})

const auctionJob = () => {
    schedule.scheduleJob('0 0 0 * * *', async () => {
        const products = await AuctionModel.find();

        for (const product of products) {
            const began = new Date(product.began);
            const end = new Date(product.end);

            // Launch Event
            if (began >= Date.now()) {
                product.isLaunch = true;
                await product.save();
            }

            // End Event
            if (end >= Date.now()) {
                product.isLaunch = false;
                product.isEnded = true;
                await product.save();

                // add product to cart of finalUser
                await addProductToCart(product);
            }
        }
    });
}

module.exports = {
    eventJob,
    auctionJob,
}