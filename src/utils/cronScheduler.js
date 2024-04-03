const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const schedule = require('node-schedule');

const asyncHandler = require("../middlewares/asyncHandler");
const EventModel = require("../models/eventModel");
const ProductModel = require("../models/productModel");
const AuctionModel = require("../models/auctionModel");
const CartModel = require("../models/cartModel");
const UserModel = require("../models/userModel");

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

const addProductToCart = async (product) => {
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
}

const refundRegisteredAuctions = async (product) => {
    const users = product.lastPrices.filter((user) =>
        user.user._id.toString() !== product.finalUser.id.toString()
    );

    const idList = users.map(item => item.user._id.toString());
    const uniqueIds = [...new Set(idList)];

    for (const userId of uniqueIds) {
        const user = await UserModel.findById(userId);

        if (user.registerAuction.auctionId._id.toString() === product._id.toString()) {
            const registeredAuctionId = user.registerAuction._id;
            // refund 100$ to this user
            await stripe.refunds.create({
                payment_intent: user.registerAuction.refundId,
                amount: 100 * 100,
            });

            // delete it from this user
            await UserModel.findByIdAndUpdate(userId, {
                $pull: {
                    registerAuction: {_id: registeredAuctionId}
                }
            });

        }
    }
}

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

                // refund all registered auction to all users only user has win
                await refundRegisteredAuctions(product);
            }
        }
    });
}

module.exports = {
    eventJob,
    auctionJob,
}