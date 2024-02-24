const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    nId: {
        type: String,
        required: [true, "national ID is required"],
        trim: true,
        unique: true,
        length: [14, "national ID not valid"]
    },
    name: {
        type: String,
        required: [true, "name is required"],
        trim: true,
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, "username is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "too short password"],
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
    },
    profileImg: {
        type: String,
        default: "defaultImage.png",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    role: {
        type: String,
        required: [true, "role is required"],
        enum: ["IT", "Tracker"],
    }
}, {timestamps: true,});

// const setImageURL = (doc) => {
//     if (doc.coverImage) {
//         doc.coverImage = `${process.env.BASE_URL}/admins/${doc.coverImage}`;
//     }
//
//     if (doc.images) {
//         const images = [];
//         doc.images.forEach((image) => {
//             const imageUrl = `${process.env.BASE_URL}/admins/${image}`;
//             images.push(imageUrl);
//         });
//         doc.images = images;
//     }
// };
//
// adminSchema.post("init", (doc) => {
//     setImageURL(doc);
// });
// adminSchema.post("save", (doc) => {
//     setImageURL(doc);
// });

const AdminModel = mongoose.model("admin", adminSchema);

module.exports = AdminModel;