const express = require('express');

const {
    getAvailableProductsReport
} = require("../controllers/reportController")
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, allowedToUser, allowedToArtist, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.get("/availableProductReport", getAvailableProductsReport);

module.exports = router;