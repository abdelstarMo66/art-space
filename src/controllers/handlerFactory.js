const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const UserModel = require("../models/userModel");

const getAll = (Model, modelName) => asyncHandler(async (req, res, next) => {
    const docsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(), req.query)
        .paginate(docsCount)
        .sort()
        .limitField();

    const {mongooseQuery, paginationResult} = apiFeatures

    const docs = await mongooseQuery;

    if (!docs) {
        return next(new ApiError(`No ${modelName} found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `${modelName} Found`,
            200,
            {
                pagination: paginationResult,
                data: docs
            }
        ));
});

const getOne = (Model, modelName) => asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const doc = await Model.findById(id, "-password -__v");

    return res.status(200).json(
        apiSuccess(
            "user found successfully",
            200,
            {data: doc}
        ));
})

module.exports = {
    getAll,
    getOne,
}