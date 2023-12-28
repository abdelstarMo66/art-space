const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "title of category is required"],
    },

    slug: {
        type: String,
        lowercase: true,
    }
}, {timestamps: true})

const CategoryModel = mongoose.model("category", categorySchema);

module.exports = CategoryModel;