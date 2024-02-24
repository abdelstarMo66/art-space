const asyncHandler = require("../middlewares/asyncHandler");

const StyleModel = require("../models/styleModel");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");

const createStyle = asyncHandler(async (req, res) => {
    await StyleModel.create(req.body);

    return res.status(201).json(
        apiSuccess(
            `add style successfully..`,
            201,
            null,
        ));
});

const getStyles = asyncHandler(async (req, res, next) => {
    const stylesCount = await StyleModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(stylesCount / limit);
    pagination.totalResults = stylesCount;
    if (endIndex < stylesCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }

    const selectedField = "title slug";

    const styles = await StyleModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(selectedField);

    if (!styles) {
        return next(new ApiError(`No styles found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `styles Found`,
            200,
            {
                pagination,
                styles
            }
        ));
});

const getStyle = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const style = await StyleModel.findById(id);

    return res.status(200).json(
        apiSuccess(
            "style found successfully",
            200,
            {style},
        ));
});

const updateStyle = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const style = await StyleModel.findByIdAndUpdate(id, req.body, {new: true});

    return res.status(200).json(
        apiSuccess(
            "style updated successfully",
            200,
            {style},
        ));

});

const deleteStyle = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await StyleModel.findByIdAndDelete(id);

    return res.status(200).json(
        apiSuccess(
            "style deleted successfully",
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

    const styles = await StyleModel.find(queryObj, "-__v");

    if (!styles) {
        return next(new ApiError(`No styles found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `styles Found`,
            200,
            {styles}
        ));
});

module.exports = {
    createStyle,
    getStyles,
    getStyle,
    search,
    updateStyle,
    deleteStyle,
}