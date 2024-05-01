const express = require('express');

const {
    bookEvent,
    getBookEvent
} = require("../controllers/bookEventController")
const {bookEventValidation} = require("../validations/bookEventValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToUser, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken, allowedToUser(), permissionValidate);

router.get("/", getBookEvent)

router.post("/:eventId", bookEventValidation, validationMiddleware, bookEvent)

module.exports = router
