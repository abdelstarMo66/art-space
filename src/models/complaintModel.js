const mongoose = require("mongoose")

const complaintSchema = new mongoose.Schema({
        sender: {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
            },
            artist: {
                type: mongoose.Schema.ObjectId,
                ref: "artist",
            }
        },

        message: {
            type: String,
            required: [true, "message is required"],
            maxLength: [500, "too long message of this complaint"]
        },

        attachment: {
            public_id: String,
            secure_url: String,
        }
    },
    {timestamps: true});

complaintSchema.pre(/^find/, function (next) {
    this.populate({
        path: "sender.user",
    });

    this.populate({
        path: "sender.artist",
    });
    next();
});

const ComplaintModel = mongoose.model("complaint", complaintSchema);

module.exports = ComplaintModel;