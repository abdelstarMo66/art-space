const mongoose = require("mongoose")

const artistSchema = new mongoose.Schema({
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
        type: String,
        default: "defaultImage.png",
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

const setImageURL = (doc) => {
    if (doc.profileImg) {
        doc.profileImg = `${process.env.BASE_URL}/artists/${doc.profileImg}`;
    }
};

artistSchema.post("init", (doc) => {
    setImageURL(doc);
});
artistSchema.post("save", (doc) => {
    setImageURL(doc);
});

const ArtistModel = mongoose.model("artist", artistSchema);

module.exports = ArtistModel;