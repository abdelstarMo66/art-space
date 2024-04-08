const mongoose = require("mongoose")

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
        maxLength: [200, "bio must be less than 500 characters"],
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

const ArtistModel = mongoose.model("artist", artistSchema);

module.exports = ArtistModel;