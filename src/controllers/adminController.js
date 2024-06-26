const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const generateJWT = require("../utils/generateJWT");
const {adminData, allAdminData} = require("../utils/responseModelData")
const AdminModel = require("../models/adminModel");
const ApiFeatures = require("../utils/apiFeatures");
const ProductModel = require("../models/productModel");

const uploadProfileImage = uploadSingleImage("profileImg", "admin");

const uploadToHost = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const options = {
            folder: "admin",
            public_id: req.file.filename,
            use_filename: true,
            resource_type: "image",
            format: "jpg",
        };

        req.body.profileImg = await cloudinary.uploader.upload(req.file.path, options);
    }
    next();
});

const createAdmin = asyncHandler(async (req, res) => {
    const admin = await AdminModel.create(req.body);
    admin.password = await bcrypt.hash(admin.password, 12)

    await admin.save();

    return res.status(201).json(
        apiSuccess(
            "Registration Successfully..",
            201,
            null,
        ));
});

const getAdmins = asyncHandler(async (req, res, next) => {
    const adminsCount = await AdminModel.countDocuments();

    const apiFeatures = new ApiFeatures(AdminModel.find(), req.query)
        .paginate(adminsCount)
        .filter()
        .sort()

    const {paginationResult, mongooseQuery} = apiFeatures;

    const admins = await mongooseQuery;

    if (!admins) {
        return next(new ApiError(`No Admins Found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `Admins Found`,
            200,
            {
                pagination: paginationResult,
                admins: allAdminData(admins),
            }
        ));
});

const getAdmin = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const admin = await AdminModel.findById(id);

    return res.status(200).json(
        apiSuccess(
            "Admin Found Successfully",
            200,
            adminData(admin),
        ))
});

const updateAdmin = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const admin = await AdminModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
        role: req.body.role,
    }, {
        new: true,
    });

    if (req.body.password) {
        admin.password = await bcrypt.hash(admin.password, 12)
        admin.save();
    }

    return res.status(200).json(
        apiSuccess(
            `Admin Updated Successfully`,
            200,
            null
        ));

});

const updateImgProfile = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const admin = await AdminModel.findByIdAndUpdate(id, {
        profileImg: req.body.profileImg,
    });

    if (admin.profileImg.public_id) {
        await cloudinary.uploader.destroy(admin.profileImg.public_id);
    }

    return res.status(200).json(
        apiSuccess(
            `Profile Image Updated Successfully`,
            200,
            null
        ));
});

const deleteAdmin = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const admin = await AdminModel.findByIdAndDelete(id);

    if (admin.profileImg.public_id) {
        await cloudinary.uploader.destroy(admin.profileImg.public_id);
    }

    return res.status(200).json(
        apiSuccess(
            `Admin Deleted Successfully`,
            200,
            null
        ));

});

const search = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;

    const queryObj = {};
    queryObj.$or = [
        {name: {$regex: keyword, $options: "i"}},
        {username: {$regex: keyword, $options: "i"},},
        {phone: {$regex: keyword, $options: "i"},},
        {nId: {$regex: keyword, $options: "i"},},
    ]

    const admins = await AdminModel.find(queryObj);

    if (!admins) {
        return next(new ApiError(`No Admins Found Matched This Search Key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `Admins Found`,
            200,
            {
                admins: allAdminData(admins),
            }
        ));
});

const login = asyncHandler(async (req, res, next) => {
    const admin = await AdminModel.findOne({username: req.body.username});

    if (!admin) {
        return next(new ApiError("Incorrect Username or Password", 401));
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);

    if (!(isPasswordCorrect)) {
        return next(new ApiError("Incorrect Username or Password", 401));
    }

    const token = await generateJWT({id: admin._id, role: "admin"});

    const adminName = admin.name.split(" ")[0];

    return res.status(200).json(
        apiSuccess(
            `Login Successfully, Welcome ${adminName}`,
            200,
            {
                token
            },
        ));
});

const setProfileID = asyncHandler(async (req, res, next) => {
    req.params.id = req.loggedUser._id;
    next();
});

const updateProfile = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const admin = await AdminModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
    }, {
        new: true,
    });

    if (req.body.password) {
        admin.password = await bcrypt.hash(admin.password, 12)
        admin.save();
    }

    return res.status(200).json(
        apiSuccess(
            `Profile Updated Successfully`,
            200,
            null
        ));
});

const changePassword = asyncHandler(async (req, res) => {
    const id = req.loggedUser._id;

    const admin = await AdminModel.findByIdAndUpdate(
        id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    const token = await generateJWT({id: admin._id, role: "admin"});

    return res.status(200).json(
        apiSuccess(
            `password changed successfully`,
            200,
            {token}
        ));
})

module.exports = {
    createAdmin,
    uploadProfileImage,
    uploadToHost,
    getAdmins,
    getAdmin,
    updateAdmin,
    updateImgProfile,
    deleteAdmin,
    search,
    login,
    setProfileID,
    updateProfile,
    changePassword,
}