const dotenv = require("dotenv");
dotenv.config({path: "config/config.env",});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const asyncHandler = require("../middlewares/asyncHandler");
const AuctionModel = require("../models/auctionModel");
const apiSuccess = require("../utils/apiSuccess");
const UserModel = require("../models/userModel");
const RegisterAuctionModel = require("../models/registerAuctionModel")

const checkoutSession = asyncHandler(async (req, res) => {
    const {auctionId} = req.params;

    const auction = await AuctionModel.findById(auctionId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: "USD",
                unit_amount: 100 * 100,
                product_data: {
                    name: auction.title,
                },
            },
            quantity: 1,
        }],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/api/v1/auction/product/${auctionId}`,
        cancel_url: `${req.protocol}://${req.get("host")}/api/v1/users/getProfile`,
        // customer: req.loggedUser._id.toString(),
        customer_email: req.loggedUser.email,
        client_reference_id: auctionId,
        metadata: {auctionId},
    });

    return res.status(200).json(
        apiSuccess(
            `session started`,
            200,
            session,
        ));
})

const registerToAuction = async (session) => {
    const {client_reference_id, payment_intent} = session;
    const email = session.customer_email;

    const registerUser = await UserModel.findOne({email});

    let registerAuction = await RegisterAuctionModel.find({user: registerUser._id});

    if (!registerAuction) {
        await RegisterAuctionModel.create({user: registerUser._id});
    }

    await RegisterAuctionModel.findByIdAndUpdate(registerUser._id, {
        $addToSet: {
            auctions: {auctionId: client_reference_id, refundId: payment_intent},
        }
    });
}

const registerAuctionWebhookCheckout = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.Register_Auction_STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        await registerToAuction(event.data.object);
    }

    return res.status(200).json(
        apiSuccess(
            `received webhook successfully`,
            200,
            null,
        ));
});

const getRegisterAuctions = asyncHandler(async (req, res) => {
    const registerAuction = await RegisterAuctionModel.find({user: req.loggedUser._id});

    return res.status(200).json(
        apiSuccess(
            "Register Auction Founded successfully",
            200,
            registerAuction
        ));
});

module.exports = {
    checkoutSession,
    registerAuctionWebhookCheckout,
    getRegisterAuctions,
}