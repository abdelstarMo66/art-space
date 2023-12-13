const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type: "String",
        required: [true, "name is required"],
        trim: true,
    },
    email: {
        type: "String",
        lowercase: true,
        unique: true,
        required: [true, "email is required"],
    },
    password: {
        type: "String",
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
    address: {
        type: String
    },
    gender: {
        type: "String",
        enum: ["male", "female"],
    },
    passwordChangedAt: Date
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;