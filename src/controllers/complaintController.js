const {v2: cloudinary} = require("cloudinary");

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {allComplaintData} = require("../utils/responseModelData")
const ApiFeatures = require("../utils/apiFeatures");
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

const sendUserComplaint = asyncHandler(async (req, res) => {
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

const sendArtistComplaint = asyncHandler(async (req, res) => {
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

    const apiFeatures = new ApiFeatures(ComplaintModel.find(), req.query)
        .paginate(complaintsCount)
        .filter()
        .sort()

    const {paginationResult, mongooseQuery} = apiFeatures;

    const complaints = await mongooseQuery;

    if (!complaints) {
        return next(new ApiError(`No complaint found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `complaint Found`,
            200,
            {
                pagination: paginationResult,
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