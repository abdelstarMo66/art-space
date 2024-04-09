const asyncHandler = require("../middlewares/asyncHandler");

const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const {allCategoryData} = require("../utils/responseModelData");
const CategoryModel = require("../models/categoryModel");

const createCategory = asyncHandler(async (req, res) => {
    await CategoryModel.create(req.body);

    return res.status(201).json(
        apiSuccess(
            `add category successfully..`,
            201,
            null,
        ));
});

const getCategories = asyncHandler(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query).sort();

    const {mongooseQuery} = apiFeatures;

    const categories = await mongooseQuery;


    if (!categories) {
        return next(new ApiError(`No categories found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `categories Found`,
            200,
            allCategoryData(categories),
        ));
});

const getCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const category = await CategoryModel.findById(id);

    return res.status(200).json(
        apiSuccess(
            "category found successfully",
            200,
            {category},
        ));
});

const updateCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const category = await CategoryModel.findByIdAndUpdate(id, req.body, {new: true});

    return res.status(200).json(
        apiSuccess(
            "category updated successfully",
            200,
            {category},
        ));

});

const deleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await CategoryModel.findByIdAndDelete(id);

    return res.status(200).json(
        apiSuccess(
            "category deleted successfully",
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

    const categories = await CategoryModel.find(queryObj, "-__v");

    if (!categories) {
        return next(new ApiError(`No categories found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `categories Found`,
            200,
            {categories}
        ));
});

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    search,
    updateCategory,
    deleteCategory,
}