const {v2: cloudinary} = require("cloudinary");

const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const {eventData, allEventData} = require("../utils/responseModelData")
const ApiFeatures = require("../utils/apiFeatures");
const EventModel = require("../models/eventModel");
const BookEventModel = require("../models/bookEventModel");

const uploadCoverImage = uploadSingleImage("coverImage", "event");

const uploadToHost = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const options = {
            folder: "event",
            public_id: req.file.filename,
            use_filename: true,
            resource_type: "image",
            format: "jpg",
        };

        req.body.coverImage = await cloudinary.uploader.upload(req.file.path, options);
    }

    next();
});

const createEvent = asyncHandler(async (req, res) => {
    const began = new Date(`${req.body.began}`);

    await EventModel.create({
        title: req.body.title,
        description: req.body.description,
        owner: req.loggedUser._id,
        duration: parseInt(req.body.duration),
        began: req.body.began,
        end: began.setDate(began.getDate() + +req.body.duration),
        coverImage: req.body.coverImage,
    });

    return res.status(201).json(
        apiSuccess(
            `event created successfully..`,
            201,
            null,
        ));
});

const getEvents = asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
        filter = req.filterObj;
    }

    const eventsCount = await EventModel.countDocuments(filter);

    const apiFeatures = new ApiFeatures(EventModel.find(filter), req.query)
        .paginate(eventsCount)
        .filter()
        .sort()

    const {paginationResult, mongooseQuery} = apiFeatures;

    const events = await mongooseQuery;

    if (!events) {
        return next(new ApiError(`No events found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `events Found`,
            200,
            {
                pagination: paginationResult,
                events: allEventData(events),
            }
        ));
});

const getEvent = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const event = await EventModel.findById(id);

    const check = await BookEventModel.find({user: req.loggedUser._id, events: {$in: [id]}});

    let userBookedThisEvent = false;

    if (check.length > 0) {
        userBookedThisEvent = true;
    }

    return res.status(200).json(
        apiSuccess(
            "event found successfully",
            200,
            eventData(event, userBookedThisEvent),
        ));
});

const updateEvent = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    if (req.body.began) {
        if (Date.now() > new Date(`${req.body.began}`)) {
            return next(new ApiError(`this event is already started`, 404));
        }
    }

    const event = await EventModel.findByIdAndUpdate(id,
        {
            title: req.body.title,
            description: req.body.description,
            duration: parseInt(req.body.duration),
            began: req.body.began,
        },
        {new: true},
    );

    if (req.body.duration) {
        const began = new Date(`${event.began}`);

        event.end = began.setDate(began.getDate() + +req.body.duration);
        await event.save();
    }

    if (req.body.began) {
        const began = new Date(`${req.body.began}`);

        event.end = began.setDate(began.getDate() + +req.body.duration);
        await event.save();
    }

    return res.status(200).json(
        apiSuccess(
            "event updated successfully",
            200,
            null,
        ));

});

const deleteEvent = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const event = await EventModel.findByIdAndDelete(id);

    if (event.coverImage.public_id) {
        await cloudinary.uploader.destroy(event.coverImage.public_id);
    }

    return res.status(200).json(
        apiSuccess(
            "event deleted successfully",
            200,
            null,
        ));
});

const search = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;

    const queryObj = {};
    queryObj.$or = [
        {title: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"},},
        {owner: {$regex: keyword, $options: "i"},},
        {events: {$regex: keyword, $options: "i"},},
    ]

    const events = await EventModel.find(queryObj, "-__v");

    if (!events) {
        return next(new ApiError(`No events found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `events Found`,
            200,
            {
                events: allEventData(events),
            }
        ));
});

const getMeEvents = asyncHandler(async (req, res, next) => {
    req.filterObj = {owner: req.loggedUser._id};

    next();
});

const changeCoverImage = asyncHandler(async (req, res, next) => {
    const {coverImage} = req.body;
    const {eventId} = req.params;

    const event = await EventModel.findByIdAndUpdate(eventId, {coverImage});

    if (!event) {
        return next(new ApiError(`No product found`, 404));
    }

    if (event.coverImage.publicId) {
        await cloudinary.uploader.destroy(event.coverImage.publicId);
    }

    return res.status(200).json(
        apiSuccess(
            "Cover Image updated successfully",
            200,
            null,
        ));
});

const addProductToMyEvent = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {productId} = req.body;

    await EventModel.findByIdAndUpdate(id,
        {
            $addToSet: {
                products: productId
            }
        },
        {new: true},
    );

    return res.status(200).json(
        apiSuccess(
            "product added successfully",
            200,
            null,
        ));
})

const removeProductFromMyEvent = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {productId} = req.body

    await EventModel.findByIdAndUpdate(id,
        {
            $pull: {
                products: productId
            }
        },
        {new: true},
    );

    return res.status(200).json(
        apiSuccess(
            "product removed successfully",
            200,
            null,
        ));
});

module.exports = {
    uploadCoverImage,
    uploadToHost,
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    search,
    getMeEvents,
    changeCoverImage,
    addProductToMyEvent,
    removeProductFromMyEvent
}