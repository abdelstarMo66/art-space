const dotenv = require("dotenv");
dotenv.config({path: "config/config.env",});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/apiError");
const apiSuccess = require("../utils/apiSuccess");
const convertCurrency = require("../utils/convertCurrency");
const {orderData, allOrderData} = require("../utils/responseModelData");
const ApiFeatures = require("../utils/apiFeatures");
const ProductModel = require("../models/productModel");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const UserModel = require("../models/userModel");

const createCashOrder = asyncHandler(async (req, res, next) => {
    const {cartId} = req.params;

    const cart = await CartModel.findById(cartId);

    const orderPrice = cart.totalCartPrice;

    const order = await OrderModel.create({
        user: req.loggedUser._id,
        shippingAddress: req.body.shippingAddress,
        cartItems: cart.cartItems,
        totalOrderPrice: orderPrice,
    })

    if (!order) {
        return next(new ApiError("something happened when creating order, please try again", 500));
    }

    for (let i = 0; i < cart.cartItems.length; i++) {
        const product = await ProductModel.findById(cart.cartItems[i].product);
        product.isAvailable = false;
        await product.save();
    }

    await CartModel.findByIdAndDelete(cartId);

    order.orderState = "Confirmed";
    await order.save();

    return res.status(201).json(
        apiSuccess(
            `Order Confirmed`,
            201,
            null,
        ));
});

const getOrders = asyncHandler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(OrderModel.find(), req.query)

    const {mongooseQuery} = apiFeatures;

    let orders = await mongooseQuery;

    if (!orders) {
        return next(new ApiError(`No orders found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `orders Found`,
            200,
            allOrderData(orders)
        ));
});

const getMyOrders = asyncHandler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(OrderModel.find({user: req.loggedUser._id}), req.query)

    const {mongooseQuery} = apiFeatures;

    let orders = await mongooseQuery;

    if (!orders) {
        return next(new ApiError(`No orders found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `orders Found`,
            200,
            allOrderData(orders)
        ));
});

const getOrder = asyncHandler(async (req, res) => {
    const {orderId} = req.params;

    const order = await OrderModel.findById(orderId);

    const user = await UserModel.findById(order.user);

    const address = user.addresses.find(addr => addr._id.equals(order.shippingAddress));

    return res.status(200).json(
        apiSuccess(
            "order found successfully",
            200,
            orderData(order, address),
        ));
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const {orderId} = req.params;

    await OrderModel.findOneAndUpdate(
        {_id: orderId},
        {
            isPaid: true,
            paidAt: Date.now(),
        },
        {new: true}
    );

    return res.status(200).json(
        apiSuccess(
            "order paid successfully",
            200,
            null,
        ));
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const {orderId} = req.params;

    await OrderModel.findOneAndUpdate(
        {_id: orderId},
        {
            isDelivered: true,
            deliveredAt: Date.now(),
        },
        {new: true}
    );

    return res.status(200).json(
        apiSuccess(
            "order delivered successfully",
            200,
            null,
        ));
});

const updateOrderState = asyncHandler(async (req, res) => {
    const {state} = req.body;
    const {orderId} = req.params;

    await OrderModel.findOneAndUpdate(
        {_id: orderId},
        {
            orderState: state,
        },
        {new: true}
    );

    return res.status(200).json(
        apiSuccess(
            `this order become ${state}`,
            200,
            null,
        ));
});

const checkoutSession = asyncHandler(async (req, res) => {
    const {currency} = req.headers;
    const {shippingAddress} = req.body;
    const {cartId} = req.params;

    const cart = await CartModel.findById(cartId);

    const unitAmount = async (price) => currency ? await convertCurrency("USD", currency, price) : price;

    let listItems = [];

    for (let i = 0; i < cart.cartItems.length; i++) {
        const amount = await unitAmount(cart.cartItems[i].product.price) * 100

        listItems.push({
            price_data: {
                currency: currency ?? "USD",
                unit_amount: amount,
                product_data: {
                    name: cart.cartItems[i].product.title,
                },
            },
            quantity: 1,
        })
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: listItems,
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/api/v1/order/${
            cart._id
        }`,
        cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
        customer: req.loggedUser._id,
        customer_email: req.loggedUser.email,
        client_reference_id: cart._id.toString(),
        metadata: {shippingAddress},
    });

    return res.status(200).json(
        apiSuccess(
            `session started`,
            200,
            session,
        ));
})

const createCardOrder = async (session) => {
    const cartId = session.client_reference_id
    const totalOrderAmount = session.amount_total / 100;
    const currency = session.currency;
    const address = session.metadata.shippingAddress;
    const email = session.customer_email;

    const cart = await CartModel.findById(cartId);
    const user = await UserModel.findOne({email});

    await OrderModel.create({
        user: user._id,
        shippingAddress: address,
        cartItems: cart.cartItems,
        totalOrderPrice: totalOrderAmount,
        paymentMethodType: "card",
        currency,
        isPaid: true,
        paidAt: Date.now(),
        orderState: "Confirmed",
        isDelivered: true,
        deliveredAt: Date.now(),
    })

    for (let i = 0; i < cart.cartItems.length; i++) {
        const product = await ProductModel.findById(cart.cartItems[i].product);
        product.isAvailable = false;
        await product.save();
    }

    await CartModel.findByIdAndDelete(cartId);
}

const orderWebhookCheckout = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.ORDER_STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    if (event.type === "checkout.session.completed") {
        await createCardOrder(event.data.object);
    }

    return res.status(200).json(
        apiSuccess(
            `received webhook successfully`,
            200,
            null,
        ));
});

module.exports = {
    createCashOrder,
    getOrders,
    getOrder,
    getMyOrders,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderState,
    checkoutSession,
    orderWebhookCheckout,
}