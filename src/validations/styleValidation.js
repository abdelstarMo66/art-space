const {param, body, check} = require("express-validator");
const slugify = require("slugify")

const ApiError = require("../utils/apiError");
const StyleModel = require("../models/styleModel");

exports.createStyleValidation = [
    body("title")
        .notEmpty()
        .withMessage("title of style is required")
        .isLength({min: 3})
        .withMessage("Too short style name")
        .isLength({max: 32})
        .withMessage("Too long style name")
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
];

exports.getStyleValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Style Id")
        .custom(async (val) => {
            const style = await StyleModel.findById(val);

            if (!style) {
                return Promise.reject(new ApiError(`no style for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.updateStyleValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Style Id")
        .custom(async (val) => {
            const style = await StyleModel.findById(val);

            if (!style) {
                return Promise.reject(new ApiError(`no style for this id ${val}`, 404));
            }
            return true;
        }),

    body("title")
        .optional()
        .isLength({min: 3})
        .withMessage("Too short style name")
        .isLength({max: 32})
        .withMessage("Too long style name")
        .custom((val, {req}) => {
            req.body.slug = slugify(val);
            return true;
        }),
];

exports.deleteStyleValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Style Id")
        .custom(async (val) => {
            const style = await StyleModel.findById(val);

            if (!style) {
                return Promise.reject(new ApiError(`no style for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.searchValidation = [
    check("keyword").notEmpty().withMessage("keyword search must be not empty"),
];