const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "title of subject is required"],
    },

    slug: {
        type: String,
        lowercase: true,
    }
}, {timestamps: true})

const SubjectModel = mongoose.model("subject", subjectSchema);

module.exports = SubjectModel;