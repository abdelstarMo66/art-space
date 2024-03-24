const {body, param} = require("express-validator");

const ApiError = require("../utils/apiError");
const StyleModel = require("../models/styleModel");
const SubjectModel = require("../models/subjectModel");
const CategoryModel = require("../models/categoryModel");
const AuctionModel = require("../models/auctionModel");

exports.addProductToAuctionValidation = [
    body("title")
        .notEmpty()
        .withMessage("title of product must not be empty")
        .isLength({min: 3})
        .withMessage("title must be at least 3 chars"),

    body("description")
        .notEmpty()
        .withMessage("description of product must not be empty")
        .isLength({min: 50})
        .withMessage("description must be at least 50 chars"),

    body("finalPrice")
        .notEmpty()
        .withMessage("Product price is required")
        .isDecimal()
        .withMessage("Product price must be a number"),

    body("category")
        .notEmpty()
        .withMessage("Product must belong to category")
        .isMongoId()
        .withMessage("category id not valid")
        .custom((categoryId) =>
            CategoryModel.findById(categoryId).then((category) => {
                if (!category) {
                    return Promise.reject(new ApiError(`No category for this id: ${categoryId}`, 404));
                }
            })
        ),

    body("style")
        .notEmpty()
        .withMessage("Product must belong to style")
        .isMongoId()
        .withMessage("style id not valid")
        .custom((styleId) =>
            StyleModel.findById(styleId).then((style) => {
                if (!style) {
                    return Promise.reject(new ApiError(`No category for this id: ${styleId}`, 404));
                }
            })
        ),

    body("subject")
        .notEmpty()
        .withMessage("Product must belong to subject")
        .isMongoId()
        .withMessage("subject id not valid")
        .custom((subjectId) =>
            SubjectModel.findById(subjectId).then((subject) => {
                if (!subject) {
                    return Promise.reject(new ApiError(`No category for this id: ${subjectId}`, 404));
                }
            })
        ),

    body("height")
        .notEmpty()
        .withMessage("Product height is required")
        .isDecimal()
        .withMessage("Product height must be a number"),

    body("width")
        .notEmpty()
        .withMessage("Product width is required")
        .isDecimal()
        .withMessage("Product width must be a number"),

    body("depth")
        .notEmpty()
        .withMessage("Product depth is required")
        .isDecimal()
        .withMessage("Product depth must be a number"),

    body("coverImage")
        .notEmpty()
        .withMessage("Product Image Cover is required"),

    body("images")
        .optional()
        .isArray()
        .withMessage("images should be array of string"),

    body("material")
        .notEmpty()
        .withMessage("Product material is required"),

    body("duration")
        .notEmpty()
        .withMessage("duration of event is required")
        .isInt({max: 14})
        .withMessage("Too long event duration"),

    body("began")
        .notEmpty()
        .withMessage("launch date of event is required")
        .isDate()
        .withMessage("launch date of event must be invalid date ex: (2024-01-18)"),
]

exports.updateProductFromAuctionValidation = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product id")
        .custom(async (val, {req}) => {
            const product = await AuctionModel.findById(val);

            if (!product) {
                return Promise.reject(new ApiError(`no product found for this id ${val}`, 404));
            }

            if (product.artist.id !== req.loggedUser._id.toString()) {
                return Promise.reject(new ApiError(`this product not belong to this artist`, 400));
            }

            if (req.body.began) {
                if (Date.now() > new Date(`${product.began}`)) {
                    return Promise.reject(new ApiError(`this auction is already started`, 404));
                }
            }

            return true;
        }),

    body("title")
        .optional()
        .isLength({min: 3})
        .withMessage("title must be at least 3 chars"),

    body("description")
        .optional()
        .isLength({min: 50})
        .withMessage("description must be at least 3 chars"),

    body("price")
        .optional()
        .isDecimal()
        .withMessage("Product price must be a number"),

    body("category")
        .optional()
        .isMongoId()
        .withMessage("category id not valid")
        .custom((categoryId) =>
            CategoryModel.findById(categoryId).then((category) => {
                if (!category) {
                    return Promise.reject(new ApiError(`No category for this id: ${categoryId}`, 404));
                }
            })
        ),

    body("style")
        .optional()
        .isMongoId()
        .withMessage("style id not valid")
        .custom((styleId) =>
            StyleModel.findById(styleId).then((style) => {
                if (!style) {
                    return Promise.reject(new ApiError(`No category for this id: ${styleId}`, 404));
                }
            })
        ),

    body("subject")
        .optional()
        .isMongoId()
        .withMessage("subject id not valid")
        .custom((subjectId) =>
            SubjectModel.findById(subjectId).then((subject) => {
                if (!subject) {
                    return Promise.reject(new ApiError(`No category for this id: ${subjectId}`, 404));
                }
            })
        ),

    body("height")
        .optional()
        .isDecimal()
        .withMessage("Product height must be a number"),

    body("width")
        .optional()
        .isDecimal()
        .withMessage("Product width must be a number"),

    body("depth")
        .optional()
        .isDecimal()
        .withMessage("Product depth must be a number"),

    body("material").optional(),

    body("duration")
        .optional()
        .isInt({max: 14})
        .withMessage("Too long event duration"),

    body("began")
        .optional()
        .isDate()
        .withMessage("launch date of event must be invalid date ex: (2024-01-18)"),
]

exports.deleteProductFromAuctionValidation = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product id")
        .custom(async (val, {req}) => {
            const product = await AuctionModel.findById(val);

            if (!product) {
                return Promise.reject(new ApiError(`no product found for this id ${val}`, 404));
            }

            if (product.artist.id !== req.loggedUser._id.toString()) {
                return Promise.reject(new ApiError(`this product not belong to this artist`, 400));
            }

            return true;
        }),
]

exports.updateFinalPriceValidation = [
    param("productId")
        .isMongoId()
        .withMessage("Invalid product id")
        .custom(async (val, {req}) => {
            const product = await AuctionModel.findById(val);

            if (!product) {
                return Promise.reject(new ApiError(`no product found for this id ${val}`, 404));
            }

            if (Date.now() < new Date(`${product.began}`)) {
                return Promise.reject(new ApiError(`auction not start yet`, 404));
            }

            return true;
        }),

    body("finalPrice")
        .notEmpty()
        .withMessage("Product price is required")
        .isDecimal()
        .withMessage("Product price must be a number"),
]