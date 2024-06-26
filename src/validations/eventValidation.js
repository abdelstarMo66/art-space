const {param, body, query} = require("express-validator");

const ApiError = require("../utils/apiError");
const EventModel = require("../models/eventModel");
const ProductModel = require("../models/productModel");

exports.createEventValidation = [
    body("title")
        .notEmpty()
        .withMessage("title of event is required")
        .isLength({max: 100})
        .withMessage("Too long event name"),

    body("description")
        .notEmpty()
        .withMessage("description of event is required")
        .isLength({min: 100})
        .withMessage("Too short event description")
        .isLength({max: 500})
        .withMessage("Too long event description"),

    body("duration")
        .notEmpty()
        .withMessage("duration of event is required")
        .isInt({max: 14})
        .withMessage("Too long event duration"),

    body("began")
        .notEmpty()
        .withMessage("launch date of event is required")
        .isDate()
        .withMessage("launch date of event must be invalid date ex: (2024-01-18)")
        .custom((val) => {
            const began = new Date(`${val}`);

            if (began < Date.now()) {
                return Promise.reject(new ApiError(`invalid began date`, 400));
            }

            return true;
        }),
];

exports.getEventValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid Event Id")
        .custom(async (val) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.updateEventValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid event id")
        .custom(async (val) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }
            return true;
        }),

    body("title")
        .optional()
        .isLength({max: 100})
        .withMessage("Too long event name"),

    body("description")
        .optional()
        .isLength({min: 100})
        .withMessage("Too short event description")
        .isLength({max: 500})
        .withMessage("Too long event description"),

    body("duration")
        .optional()
        .isInt({max: 14})
        .withMessage("Too long event duration"),

    body("began")
        .optional()
        .isDate()
        .withMessage("launch date of event must be invalid date ex: (2024-01-18)"),
];

exports.searchValidation = [
    query("keyword")
        .notEmpty()
        .withMessage("keyword search must be not empty"),
];

exports.deleteEventValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid event id")
        .custom(async (val) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }
            return true;
        }),
];

exports.getMeEventValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid event id")
        .custom(async (val, {req}) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }

            if (event.owner._id.toString() !== req.loggedUser._id.toString()) {
                return Promise.reject(new ApiError(`this event not belong to this artist`, 404));
            }

            return true;
        }),
];

exports.updateMeEventValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid event id")
        .custom(async (val, {req}) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }

            if (event.owner._id.toString() !== req.loggedUser._id.toString()) {
                return Promise.reject(new ApiError(`this event not belong to this artist`, 404));
            }

            return true;
        }),

    body("title")
        .optional()
        .isLength({max: 100})
        .withMessage("Too long event name"),

    body("description")
        .optional()
        .isLength({min: 100})
        .withMessage("Too short event description")
        .isLength({max: 500})
        .withMessage("Too long event description"),

    body("duration")
        .optional()
        .isInt({max: 14})
        .withMessage("Too long event duration"),

    body("began")
        .optional()
        .isDate()
        .withMessage("launch date of event must be invalid date ex: (2024-01-18)"),
];

exports.deleteMeEventValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid event id")
        .custom(async (val, {req}) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }

            if (event.owner._id.toString() !== req.loggedUser._id.toString()) {
                return Promise.reject(new ApiError(`this event not belong to this artist`, 404));
            }

            return true;
        }),
];

exports.ProductInMyEventValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid event id")
        .custom(async (val, {req}) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }

            if (event.owner._id.toString() !== req.loggedUser._id.toString()) {
                return Promise.reject(new ApiError(`this event not belong to this artist`, 404));
            }

            return true;
        }),

    body("productId")
        .notEmpty()
        .withMessage("productId is required")
        .isMongoId()
        .withMessage("invalid product id")
        .custom(async (val, {req}) => {
            const product = await ProductModel.findById(val);

            if (!product) {
                return Promise.reject(new ApiError(`no product found for this id ${val}`, 404));
            }

            if (product.owner._id.toString() !== req.loggedUser._id.toString()) {
                return Promise.reject(new ApiError(`this product ${val} not belong to this artist`, 400));
            }

            if (!product.inEvent) {
                return Promise.reject(new ApiError(`can not add this product to your event`, 400));
            }

            return true;
        }),
];

exports.meEventValidation = [
    param("id")
        .isMongoId()
        .withMessage("Invalid event id")
        .custom(async (val, {req}) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }

            if (event.owner._id.toString() !== req.loggedUser._id.toString()) {
                return Promise.reject(new ApiError(`this event not belong to this artist`, 404));
            }

            return true;
        }),
]