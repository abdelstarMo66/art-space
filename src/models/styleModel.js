const mongoose = require("mongoose");

const styleSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "title of style is required"],
    },

    slug: {
        type: String,
        lowercase: true,
    }
}, {timestamps: true})

const StyleModel = mongoose.model("style", styleSchema);

module.exports = StyleModel;