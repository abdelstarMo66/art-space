const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "event title is required"],
        maxLength: [100, "title must be less than 100 characters"]
    },

    description: {
        type: String,
        trim: true,
        required: [true, "event description is required"],
        maxLength: [500, "description must be less than 500 characters"],
        minLength: [100, "description must be greater than 100 characters"]
    },

    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "artist",
        required: [true, "owner is required"],
    },

    duration: {
        type: Number,
        required: [true, "duration is required"],
        max: [14, 'Too long event duration'],
    },

    began: {
        type: Date,
        required: [true, "began is required"],
    },

    end: {
        type: Date,
    },

    products: {
        type: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "product",
            }
        ],
        validate: [
            function (val) {
                return val.length <= 3 && val.length >= 10;
            }, '{PATH} must be between 3 and 10 product']
    },
}, {timestamps: true});

const EventModel = mongoose.model("event", eventSchema);

module.exports = EventModel;