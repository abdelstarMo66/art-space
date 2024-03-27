const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const generateJWT = require("../utils/generateJWT");
const {userData, allUserData, allAddresses} = require("../utils/responseModelData");
const UserModel = require("../models/userModel");
const CartModel = require("../models/cartModel");

const getAllUsers = asyncHandler(async (req, res, next) => {
    const usersCount = await UserModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(usersCount / limit);
    pagination.totalResults = usersCount;
    if (endIndex < usersCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }

    const users = await UserModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy);

    if (!users) {
        return next(new ApiError(`no users found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `users found`,
            200,
            {
                pagination,
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

    const user = await UserModel.findByIdAndUpdate(
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
}