const mongoose = require("mongoose")

const auctionSchema = new mongoose.Schema({
        artist: {
            type: mongoose.Schema.ObjectId,
            ref: "artist",
        },

        title: {
            type: String,
            required: [true, "title is required"],
            trim: true,
            minLength: [3, "too short title of product"],
            maxLength: [100, "too long title of product"]
        },

        description: {
            type: String,
            required: [true, "description is required"],
            minLength: [50, "too short description of product"],
            maxLength: [400, "too long description of product"]
        },

        isAvailable: {
            type: Boolean,
            default: true
        },

        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category",
            required: [true, "category is required"],
        },

        style: {
            type: mongoose.Schema.ObjectId,
            ref: "style",
            required: [true, "style is required"],
        },

        subject: {
            type: mongoose.Schema.ObjectId,
            ref: "subject",
            required: [true, "subject is required"],
        },

        height: {
            type: Number,
            required: [true, "height is required"],
        },

        width: {
            type: Number,
            required: [true, "width is required"],
        },

        depth: {
            type: Number,
            required: [true, "depth is required"],
        },

        coverImage: {
            public_id: String,
            secure_url: String,
        },

        images: [
            {
                public_id: String,
                secure_url: String,
            }
        ],

        material: {
            type: String,
            required: [true, "material is required"],
            trim: true,
        },

        duration: {
            type: Number,
            required: [true, "duration is required"],
            max: [14, 'Too long auction duration'],
        },

        began: {
            type: Date,
        },

        end: {
            type: Date,
        },

        finalPrice: {
            type: Number,
            required: [true, "price is required"],
        },

        finalUser: {
            type: mongoose.Schema.ObjectId,
            ref: "user"
        },

        lastPrices: [{
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user"
            },

            price: {
                type: Number,
            },
        }],

        isLaunch: {
            type: Boolean,
            default: false
        },

        isEnded: {
            type: Boolean,
            default: false
        },
    },
    {timestamps: true},
);

auctionSchema.pre(/^find/, function (next) {
    this.populate({
        path: "category",
    });
    this.populate({
        path: "style",
    });
    this.populate({
        path: "subject",
    });
    this.populate({
        path: "artist",
    });
    this.populate({
        path: "finalUser",
    });
    this.populate({
        path: "lastPrices.user",
    });
    next();
});

const AuctionModel = mongoose.model("auction", auctionSchema);

module.exports = AuctionModel;