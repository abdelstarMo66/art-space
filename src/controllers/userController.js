const dotenv = require("dotenv");
dotenv.config({path: "config/config.env",});

const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const generateJWT = require("../utils/generateJWT");
const {userData, allUserData, allAddresses} = require("../utils/responseModelData");
const ApiFeatures = require("../utils/apiFeatures");
const UserModel = require("../models/userModel");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const ProductModel = require("../models/productModel");
const {findById} = require("../models/auctionModel");

const getAllUsers = asyncHandler(async (req, res, next) => {
    const usersCount = await UserModel.countDocuments();

    const apiFeatures = new ApiFeatures(UserModel.find(), req.query)
        .paginate(usersCount)
        .filter()
        .sort()

    const {paginationResult, mongooseQuery} = apiFeatures;

    const users = await mongooseQuery;

    if (!users) {
        return next(new ApiError(`no users found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `users found`,
            200,
            {
                pagination: paginationResult,
                users: allUserData(users),
            }
        ));
});

const getUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params;


    const user = await UserModel.findById(id);

    if (!user) {
        return next(new ApiError(`no user for this id ${id}`, 404))
    }

    return res.status(200).json(
        apiSuccess(
            "user found successfully",
            200,
            userData(user)
        ));
});

const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await UserModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
    }, {
        new: true,
    });

    return res.status(200).json(
        apiSuccess(
            `user updated successfully`,
            200,
            null
        ));

});

const uploadProfileImage = uploadSingleImage("profileImg", "user");

const uploadToHost = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const options = {
            folder: "user",
            public_id: req.file.filename,
            use_filename: true,
            resource_type: "image",
            format: "jpg",
        };

        req.body.profileImg = await cloudinary.uploader.upload(req.file.path, options);
    }
    next();
});

const updateProfileImage = asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(req.loggedUser._id, {profileImg: req.body.profileImg});

    if (user.profileImg.public_id) {
        await cloudinary.uploader.destroy(user.profileImg.public_id);
    }

    return res.status(200).json(
        apiSuccess(
            "profile image updated successfully",
            200,
            null,
        ));
});

const search = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;

    const queryObj = {};
    queryObj.$or = [
        {name: {$regex: keyword, $options: "i"}},
        {email: {$regex: keyword, $options: "i"},},
        {phone: {$regex: keyword, $options: "i"},},
        {gender: {$regex: keyword, $options: "i"},},
        {address: {$regex: keyword, $options: "i"},}
    ]


    const users = await UserModel.find(queryObj);

    if (!users) {
        return next(new ApiError(`No users found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `users found`,
            200,
            {
                users: allUserData(users),
            }
        ));
});

const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const user = await UserModel.findByIdAndDelete(id);

    if (user.profileImg.public_id) {
        await cloudinary.uploader.destroy(user.profileImg.public_id);
    }

    const cart = await CartModel.findOne({user: user._id});

    if (cart) {
        await CartModel.deleteOne({user: user._id});
    }

    return res.status(200).json(
        apiSuccess(
            `user deleted successfully`,
            200,
            null
        ));

});

const setProfileID = asyncHandler(async (req, res, next) => {
    req.params.id = req.loggedUser._id;
    next();
});

const changePassword = asyncHandler(async (req, res) => {
    const id = req.loggedUser._id;

    const user = await UserModel.findByIdAndUpdate(
        id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    const token = await generateJWT({id: user._id, role: "user"});

    return res.status(200).json(
        apiSuccess(
            `password changed successfully`,
            200,
            {token}
        ));
})

const addUserAddress = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.loggedUser._id);

    for (let i = 0; i < user.addresses.length; i++) {
        if (JSON.stringify(req.body) === JSON.stringify(user.addresses[i], ["alias", "street", "region", "city", "country", "postalCode", "phone"])
            || JSON.stringify(req.body) === JSON.stringify(user.addresses[i], ["alias", "street", "region", "city", "country", "postalCode"])
            || JSON.stringify(req.body) === JSON.stringify(user.addresses[i], ["alias", "street", "region", "city", "country", "phone"])
            || JSON.stringify(req.body) === JSON.stringify(user.addresses[i], ["alias", "street", "region", "city", "country"])) {
            return res.status(200).json(
                apiSuccess(
                    "this address is already in the list of addresses",
                    200,
                    null,
                ));
        }
    }

    await user.updateOne({
            $addToSet: {addresses: req.body},
        },
        {new: true}
    )

    return res.status(201).json(
        apiSuccess(
            "Address added successfully",
            200,
            null
        ));

});

const removeUserAddress = asyncHandler(async (req, res) => {
    const {addressId} = req.params;

    await UserModel.findByIdAndUpdate(
        req.loggedUser._id,
        {
            $pull: {addresses: {_id: addressId}},
        },
        {new: true}
    );

    return res.status(200).json(
        apiSuccess(
            "Address removed successfully",
            200,
            null
        ));
});

const getProfileAddresses = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.loggedUser._id);

    return res.status(200).json(
        apiSuccess(
            "Address Founded successfully",
            200,
            {addresses: allAddresses(user.addresses)}
        ));
});

const checkoutSession = asyncHandler(async (req, res) => {
    const {auctionId} = req.params;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: "USD",
                unit_amount: 100 * 100,
                product_data: {
                    name: auctionId,
                },
            },
            quantity: 1,
        }],
        mode: "payment",
        success_url: `${req.protocol}://${req.get("host")}/api/v1/auction/product/${auctionId}`,
        cancel_url: `${req.protocol}://${req.get("host")}/api/v1/users/getProfile`,
        customer: req.loggedUser._id,
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

    const user = await UserModel.findOne({email});

    await UserModel.findByIdAndUpdate(user._id, {
        $addToSet: {
            registerAuction: {auctionId: client_reference_id, refundId: payment_intent},
        }
    });
}

const registerAuctionWebhookCheckout = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
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

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadProfileImage,
    uploadToHost,
    changePassword,
    search,
    setProfileID,
    addUserAddress,
    removeUserAddress,
    getProfileAddresses,
    updateProfileImage,
    checkoutSession,
    registerAuctionWebhookCheckout,
}