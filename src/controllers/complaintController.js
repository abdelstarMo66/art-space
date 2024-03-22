const {v2: cloudinary} = require("cloudinary");

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {allComplaintData} = require("../utils/responseModelData")
const ComplaintModel = require("../models/complaintModel")

const uploadAttachmentImage = uploadSingleImage("attachment", "complaint");

const uploadToHost = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const options = {
            folder: "complaint",
            public_id: req.file.filename,
            use_filename: true,
            resource_type: "image",
            format: "jpg",
        };

        req.body.attachment = await cloudinary.uploader.upload(req.file.path, options);
    }
    next();
});

const sendUserComplaint = asyncHandler(async (req, res, next) => {
    await ComplaintModel.create({
        sender: {
            user: req.loggedUser._id,
        },
        message: req.body.message,
        attachment: req.body.attachment,
    });

    return res.status(201).json(
        apiSuccess(
            `complaint sent successfully..`,
            201,
            null,
        ));
});

const sendArtistComplaint = asyncHandler(async (req, res, next) => {
    await ComplaintModel.create({
        sender: {
            artist: req.loggedUser._id,
        },
        message: req.body.message,
        attachment: req.body.attachment,
    });

    return res.status(201).json(
        apiSuccess(
            `complaint sent successfully..`,
            201,
            null,
        ));
});

const getComplaints = asyncHandler(async (req, res, next) => {
    const complaintsCount = await ComplaintModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(complaintsCount / limit);
    pagination.totalResults = complaintsCount;
    if (endIndex < complaintsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }


    const complaints = await ComplaintModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy);

    if (!complaints) {
        return next(new ApiError(`No complaint found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `complaint Found`,
            200,
            {
                pagination,
                complaint: allComplaintData(complaints),
            }
        ));
});

module.exports = {
    uploadAttachmentImage,
    uploadToHost,
    sendUserComplaint,
    sendArtistComplaint,
    getComplaints,
}