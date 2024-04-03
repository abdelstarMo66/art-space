const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "email is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "too short password"],
    },
    phone: {
        type: String,
    },
    profileImg: {
        public_id: String,
        secure_url: String,
    },
    addresses: [
        {
            alias: String,
            street: String,
            region: String,
            city: String,
            country: String,
            postalCode: String,
            phone: String,
        },
    ],
    registerAuction: [
        {
            auctionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "auction",
            },
            refundId: String
        },
    ],
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    accountActivateCode: String,
    AccountActivateExpires: Date,
    accountActive: {
        type: Boolean,
        default: false,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
}, {timestamps: true});

userSchema.pre(/^find/, function (next) {
    this.populate({
        path: "registerAuction.auctionId",
    });
    next();
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;