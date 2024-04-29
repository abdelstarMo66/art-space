const mongoose = require("mongoose");

const registerAuctionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: [true, "user is required"]
    },
    auctions: [
        {
            auctionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "auction",
            },
            refundId: String
        },
    ]
}, {
    timestamps: true
});

registerAuctionSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
    });
    this.populate({
        path: "auctions.auctionId",
    });
    next()
})

const RegisterAuctionModel = mongoose.model("registerAuction", registerAuctionSchema);

module.exports = RegisterAuctionModel;