const {param} = require("express-validator");

const ApiError = require("../utils/apiError");
const EventModel = require("../models/eventModel");
const BookEventModel = require("../models/bookEventModel");

exports.bookEventValidation = [
    param("eventId")
        .isMongoId()
        .withMessage("invalid event id")
        .custom(async (val, {req}) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }

            const check = await BookEventModel.find({user: req.loggedUser._id, events: {$in: [val]}});

            if (check.length > 0) {
                return Promise.reject(new ApiError(`this event already booked`, 400));
            }

            return true;
        }),
]