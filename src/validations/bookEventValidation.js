const {param} = require("express-validator");

const ApiError = require("../utils/apiError");
const EventModel = require("../models/eventModel");

exports.bookEventValidation = [
    param("eventId")
        .isMongoId()
        .withMessage("invalid event id")
        .custom(async (val) => {
            const event = await EventModel.findById(val);

            if (!event) {
                return Promise.reject(new ApiError(`no event found for this id ${val}`, 404));
            }
            return true;
        }),
]