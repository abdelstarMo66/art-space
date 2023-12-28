const {param, body, check} = require("express-validator");
const slugify = require("slugify")

const ApiError = require("../utils/apiError");
const CategoryModel = require("../models/categoryModel");

exports.createCategoryValidation = [
    body("title")
        .notEmpty()
        .withMessage("title of category is required")
        .isLength({min: 3})
        .withMessage("Too short category name")
        .isLength({max: 32})
        .withMessage("Too long category name")
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
];

exports.getCategoryValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Category Id")
        .custom(async (val) => {
            const category = await CategoryModel.findById(val);

            if (!category) {
                return Promise.reject(new ApiError(`no category for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.updateCategoryValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Category Id")
        .custom(async (val) => {
            const category = await CategoryModel.findById(val);

            if (!category) {
                return Promise.reject(new ApiError(`no category for this id ${val}`, 404));
            }
            return true;
        }),

    body("title")
        .optional()
        .isLength({min: 3})
        .withMessage("Too short category name")
        .isLength({max: 32})
        .withMessage("Too long category name")
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
];

exports.deleteCategoryValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Category Id")
        .custom(async (val) => {
            const category = await CategoryModel.findById(val);

            if (!category) {
                return Promise.reject(new ApiError(`no category for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.searchValidation = [
    check("keyword").notEmpty().withMessage("keyword search must be not empty"),
];