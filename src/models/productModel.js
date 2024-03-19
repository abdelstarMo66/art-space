const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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

    price: {
        type: Number,
        required: [true, "price is required"],
    },

    isAvailable: {
        type: Boolean,
        default: true
    },


    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "artist",
        required: [true, "owner is required"],
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
}, {timestamps: true});

productSchema.pre(/^find/, function (next) {
    this.populate({
        path: "category",
        select: "title",
    });
    this.populate({
        path: "style",
        select: "title",
    });
    this.populate({
        path: "subject",
        select: "title",
    });
    this.populate({
        path: "owner",
        select: "name",
    });
    next();
});

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;