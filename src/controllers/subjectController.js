const asyncHandler = require("../middlewares/asyncHandler");

const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const {allSubjectData} = require("../utils/responseModelData");
const SubjectModel = require("../models/subjectModel");

const createSubject = asyncHandler(async (req, res) => {
    await SubjectModel.create(req.body);

    return res.status(201).json(
        apiSuccess(
            `add subject successfully..`,
            201,
            null,
        ));
});

const getSubjects = asyncHandler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(SubjectModel.find(), req.query).sort();

    const {mongooseQuery} = apiFeatures;

    const subjects = await mongooseQuery;

    if (!subjects) {
        return next(new ApiError(`No subjects found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `subjects Found`,
            200,
            allSubjectData(subjects),
        ));
});

const getSubject = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const subject = await SubjectModel.findById(id);

    return res.status(200).json(
        apiSuccess(
            "subject found successfully",
            200,
            {subject},
        ));
});

const updateSubject = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const subject = await SubjectModel.findByIdAndUpdate(id, req.body, {new: true});

    return res.status(200).json(
        apiSuccess(
            "subject updated successfully",
            200,
            {subject},
        ));

});

const deleteSubject = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await SubjectModel.findByIdAndDelete(id);

    return res.status(200).json(
        apiSuccess(
            "subject deleted successfully",
            200,
            null,
        ));
});

const search = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;

    const queryObj = {};
    queryObj.$or = [
        {title: {$regex: keyword, $options: "i"}},
        {slug: {$regex: keyword, $options: "i"},},
    ]

    const subjects = await SubjectModel.find(queryObj, "-__v");

    if (!subjects) {
        return next(new ApiError(`No subjects found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `subjects Found`,
            200,
            {subjects}
        ));
});

module.exports = {
    createSubject,
    getSubjects,
    getSubject,
    search,
    updateSubject,
    deleteSubject,
}