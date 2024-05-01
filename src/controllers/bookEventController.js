const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const {bookEventData} = require("../utils/responseModelData");
const BookEventModel = require("../models/bookEventModel");

const bookEvent = asyncHandler(async (req, res, next) => {
    const {eventId} = req.params;

    const bookedEvents = await BookEventModel.find({user: req.loggedUser._id});

    if (bookedEvents.length === 0) {
        await BookEventModel.create({user: req.loggedUser._id});
    }

    await BookEventModel.findOneAndUpdate({user: req.loggedUser._id}, {$addToSet: {events: eventId}});

    return res.status(200).json(
        apiSuccess(
            `Book Event successfully`,
            200,
            null,
        ));
});

const getBookEvent = asyncHandler(async (req, res, next) => {
    const eventBooked = await BookEventModel.findOne({user: req.loggedUser._id});

    return res.status(200).json(
        apiSuccess(
            "Booked Event Founded successfully",
            200,
            bookEventData(eventBooked),
        ));
});

module.exports = {
    bookEvent,
    getBookEvent,
}