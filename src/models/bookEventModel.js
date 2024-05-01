const mongoose = require('mongoose');

const bookEventSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "user is required"]
    },
    events: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "event",
        },
    ]
}, {timestamps: true});

bookEventSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
    });
    this.populate({
        path: "events",
    });
    next()
})

const BookEventModel = mongoose.model('BookEvent', bookEventSchema);

module.exports = BookEventModel;