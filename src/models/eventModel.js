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

    products: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "product",
        }
    ],

    coverImage: {
        public_id: String,
        secure_url: String,
    },

    isLaunch: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

eventSchema.pre(/^find/, function (next) {
    this.populate({
        path: "products",
    });
    next();
});

const EventModel = mongoose.model("event", eventSchema);

module.exports = EventModel;