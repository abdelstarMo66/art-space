const express = require('express');

const {
    getAvailableProductsReport,
    getArtistsStatisticReport,
    getSingleArtistStatisticReport,
    getUnAvailableProductsReport,
    getLastEventsReport,
    getLastAuctionsReport,
} = require("../controllers/reportController")
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken, allowedToAdmins("CEO"), permissionValidate);

router.get("/availableProductReport", getAvailableProductsReport);

router.get("/unAvailableProductsReport", getUnAvailableProductsReport);

router.get("/artistStatisticReport", getArtistsStatisticReport);

router.get("/singleArtistStatisticReport/:artistId", getSingleArtistStatisticReport);

router.get("/lastEventsReport", getLastEventsReport);

router.get("/lastAuctionsReport", getLastAuctionsReport);

module.exports = router;