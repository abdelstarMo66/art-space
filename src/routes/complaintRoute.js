const express = require("express");

const {
    uploadAttachmentImage,
    uploadToHost,
    getComplaints,
    sendArtistComplaint,
    sendUserComplaint,
} = require("../controllers/complaintController");
const {createComplaintValidation} = require("../validations/complaintValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToArtist, permissionValidate, allowedToUser, allowedToAdmins} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.post("/user",
    allowedToUser(),
    permissionValidate,
    uploadAttachmentImage,
    createComplaintValidation,
    validationMiddleware,
    uploadToHost,
    sendUserComplaint,
);

router.post("/artist",
    allowedToArtist(),
    permissionValidate,
    uploadAttachmentImage,
    createComplaintValidation,
    validationMiddleware,
    uploadToHost,
    sendArtistComplaint,
);

router.get("/", allowedToAdmins("IT"), permissionValidate, getComplaints);

module.exports = router