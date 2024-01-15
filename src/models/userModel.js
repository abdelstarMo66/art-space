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
        doc.profileImg = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    }
};

userSchema.post("init", (doc) => {
    setImageURL(doc);
});
userSchema.post("save", (doc) => {
    setImageURL(doc);
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;