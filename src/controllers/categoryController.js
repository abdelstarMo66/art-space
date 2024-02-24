const asyncHandler = require("../middlewares/asyncHandler");

const CategoryModel = require("../models/categoryModel");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");

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
    const categoriesCount = await CategoryModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(categoriesCount / limit);
    pagination.totalResults = categoriesCount;
    if (endIndex < categoriesCount) {
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

    const categories = await CategoryModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(selectedField);

    if (!categories) {
        return next(new ApiError(`No categories found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `categories Found`,
            200,
            {
                pagination,
                categories
            }
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