const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const generateJWT = require("../utils/generateJWT");
const AdminModel = require("../models/adminModel");

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
            "registration successfully..",
            201,
            null,
        ));
});

const getAdmins = asyncHandler(async (req, res, next) => {
    const adminsCount = await AdminModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(adminsCount / limit);
    pagination.totalResults = adminsCount;
    if (endIndex < adminsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }

    const selectedField = "nId name username phone profileImg gender role";

    const admins = await AdminModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(selectedField);

    if (!admins) {
        return next(new ApiError(`No admins found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `admins Found`,
            200,
            {
                pagination,
                admins
            }
        ));
});

const getAdmin = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const selectedField = "nId name username phone profileImg gender role";

    const admin = await AdminModel.findById(id, selectedField);

    return res.status(200).json(
        apiSuccess(
            "admin found successfully",
            200,
            {admin}
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
            `admin updated successfully`,
            200,
            null
        ));

});

const updateImgProfile = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const admin = await AdminModel.findByIdAndUpdate(id, {
        profileImg: req.body.profileImg,
    });

    await cloudinary.uploader.destroy(admin.profileImg.public_id);

    return res.status(200).json(
        apiSuccess(
            `profile admin updated successfully`,
            200,
            null
        ));
});

const deleteAdmin = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const admin = await AdminModel.findByIdAndDelete(id);

    await cloudinary.uploader.destroy(admin.profileImg.public_id);

    return res.status(200).json(
        apiSuccess(
            `admin deleted successfully`,
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

    const selectedField = "nId name username phone profileImg gender role";

    const admins = await AdminModel.find(queryObj, selectedField);

    if (!admins) {
        return next(new ApiError(`No admins found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `admins Found`,
            200,
            {admins}
        ));
});

const login = asyncHandler(async (req, res, next) => {
    const admin = await AdminModel.findOne({username: req.body.username});

    if (!admin) {
        return next(new ApiError("Incorrect username or password", 401));
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, admin.password);

    if (!(isPasswordCorrect)) {
        return next(new ApiError("Incorrect username or password", 401));
    }

    const token = await generateJWT({id: admin._id, role: "admin"});

    return res.status(200).json(
        apiSuccess(
            `login successfully, welcome ${admin.name}`,
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
}