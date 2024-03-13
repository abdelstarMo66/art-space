const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const EventModel = require("../models/eventModel");

const createEvent = asyncHandler(async (req, res) => {
    const began = new Date(`${req.body.began}`);

    req.body.end = began.setDate(began.getDate() + req.body.duration);
    req.body.owner = req.loggedUser._id;

    await EventModel.create(req.body);

    return res.status(201).json(
        apiSuccess(
            `event created successfully..`,
            201,
            null,
        ));
});

const getEvents = asyncHandler(async (req, res, next) => {
    const eventsCount = await EventModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(eventsCount / limit);
    pagination.totalResults = eventsCount;
    if (endIndex < eventsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }

    let limitField = "-__v";
    if (req.query.fields) {
        limitField = req.query.fields.split(",").join(" ");
    }

    const events = await EventModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(limitField);

    if (!events) {
        return next(new ApiError(`No events found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `events Found`,
            200,
            {
                pagination,
                events
            }
        ));
});

const getEvent = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const event = await EventModel.findById(id);

    return res.status(200).json(
        apiSuccess(
            "event found successfully",
            200,
            {event},
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
            duration: req.body.duration,
            began: req.body.began,
        },
        {new: true},
    );

    if (req.body.duration) {
        const began = new Date(`${event.began}`);

        event.end = began.setDate(began.getDate() + req.body.duration);
        await event.save();
    }

    return res.status(200).json(
        apiSuccess(
            "event updated successfully",
            200,
            {event},
        ));

});

const deleteEvent = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await EventModel.findByIdAndDelete(id);

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
            {events}
        ));
});

const getMeEvents = asyncHandler(async (req, res, next) => {
    const eventsCount = await EventModel.countDocuments({owner: req.loggedUser._id});
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(eventsCount / limit);
    pagination.totalResults = eventsCount;
    if (endIndex < eventsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }

    let limitField = "-__v";
    if (req.query.fields) {
        limitField = req.query.fields.split(",").join(" ");
    }

    const events = await EventModel
        .find({owner: req.loggedUser._id})
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(limitField);

    if (!events) {
        return next(new ApiError(`No events found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `events Found`,
            200,
            {
                pagination,
                events
            }
        ));
});

const addProductToMyEvent = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const event = await EventModel.findByIdAndUpdate(id,
        {
            $addToSet: {
                products: req.body.productId
            }
        },
        {new: true},
    );

    return res.status(200).json(
        apiSuccess(
            "product added successfully",
            200,
            {event},
        ));
})

const removeProductFromMyEvent = asyncHandler(async (req,res,next)=>{
    const {id} = req.params;

    const event = await EventModel.findByIdAndUpdate(id,
        {
            $pull: {
                products: req.body.productId
            }
        },
        {new: true},
    );

    return res.status(200).json(
        apiSuccess(
            "product removed successfully",
            200,
            {event},
        ));
});

module.exports = {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    search,
    getMeEvents,
    addProductToMyEvent,
    removeProductFromMyEvent
}