const fs = require("fs");

const sharp = require("sharp");
const bcrypt = require("bcrypt");

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const UserModel = require("../models/userModel");
const generateJWT = require("../utils/generateJWT");

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

    let limitField = "-__v -password";
    if (req.query.fields) {
        limitField = req.query.fields.split(",").join(" ");
    }

    const users = await UserModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(limitField);

    if (!users) {
        return next(new ApiError(`No users found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `users Found`,
            200,
            {
                pagination,
                users
            }
        ));
});

const getUser = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const user = await UserModel.findById(id, "-password -__v");

    if (!user) {
        return next(new ApiError(`no user for this id ${id}`, 404))
    }

    return res.status(200).json(
        apiSuccess(
            "user found successfully",
            200,
            {user}
        ));
});

const uploadProfileImage = uploadSingleImage("profileImg");

const resizeProfileImage = asyncHandler(async (req, res, next) => {
    const fileName = `user-${Math.round(
        Math.random() * 1e9
    )}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 95})
            .toFile(`uploads/users/${fileName}`)
            .then(async () => {
                const user = await UserModel.findById(req.params.id);
                const oldFileName = user.profileImg;
                const filePath = `uploads/users/${oldFileName}`;
                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        // File exists, so delete it
                        fs.unlink(filePath, (deleteErr) => {
                            if (deleteErr) {
                                console.error('Error deleting file:', deleteErr);
                            }
                        });
                    }
                });
            });

        req.body.profileImg = fileName;
    }
    next();
});

const updateUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await UserModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        profileImg: req.body.profileImg,
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

    const users = await UserModel.find(queryObj, "-password -__v");

    if (!users) {
        return next(new ApiError(`No users found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `users Found`,
            200,
            {users}
        ));
});

const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const user = await UserModel.findByIdAndDelete(id);

    const oldFileName = user.profileImg;
    const filePath = `uploads/users/${oldFileName}`;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            // File exists, so delete it
            fs.unlink(filePath, (deleteErr) => {
                if (deleteErr) {
                    console.error('Error deleting file:', deleteErr);
                }
            });
        }
    });

    return res.status(200).json(
        apiSuccess(
            `user deleted successfully`,
            200,
            null
        ));

});

const getUserProfile = asyncHandler(async (req, res, next) => {
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

const updateProfile = asyncHandler(async (req, res) => {
    const id = req.loggedUser._id;

    await UserModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        profileImg: req.body.profileImg,
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
    const user = await UserModel.findByIdAndUpdate(
        req.loggedUser._id,
        {
            $pull: {addresses: {_id: req.params.addressId}},
        },
        {new: true}
    );

    return res.status(200).json(
        apiSuccess(
            "Address removed successfully",
            200,
            user.addresses
        ));
});

const getProfileAddresses = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.loggedUser._id).populate("addresses");

    return res.status(200).json(
        apiSuccess(
            "Address Founded successfully",
            200,
            user.addresses
        ));
});

module.exports = {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadProfileImage,
    resizeProfileImage,
    changePassword,
    search,
    getUserProfile,
    updateProfile,
    addUserAddress,
    removeUserAddress,
    getProfileAddresses,
}