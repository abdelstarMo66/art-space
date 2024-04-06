const express = require('express');

const {
    getAvailableProductReport
} = require("../controllers/reportController")
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, allowedToUser, allowedToArtist, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.get("/availableProductReport", getAvailableProductReport);

module.exports = router;