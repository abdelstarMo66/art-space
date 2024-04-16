const express = require("express");

const {
    createEvent,
    uploadCoverImage,
    uploadToHost,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    search,
    getMeEvents,
    changeCoverImage,
    addProductToMyEvent,
    removeProductFromMyEvent,
} = require("../controllers/eventController");
const {
    createEventValidation,
    getEventValidation,
    updateEventValidation,
    deleteEventValidation,
    searchValidation,
    getMeEventValidation,
    updateMeEventValidation,
    deleteMeEventValidation,
    ProductInMyEventValidation,
    meEventValidation,
} = require("../validations/eventValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToArtist, permissionValidate, allowedToUser, allowedToAdmins} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);


router.route("/me").get(allowedToArtist(), permissionValidate, getMeEvents, getEvents)

router.route("/me/:id")
    .get(
        allowedToArtist(),
        permissionValidate,
        getMeEventValidation,
        validationMiddleware,
        getEvent,
    )
    .patch(
        allowedToArtist(),
        permissionValidate,
        updateMeEventValidation,
        validationMiddleware,
        updateEvent,
    )
    .delete(
        allowedToArtist(),
        permissionValidate,
        deleteMeEventValidation,
        validationMiddleware,
        deleteEvent,
    )

router.route("/:id/addProduct")
    .post(
        allowedToArtist(),
        permissionValidate,
        ProductInMyEventValidation,
        validationMiddleware,
        addProductToMyEvent,
    )
    .delete(
        allowedToArtist(),
        permissionValidate,
        ProductInMyEventValidation,
        validationMiddleware,
        removeProductFromMyEvent,
    )

router.put("/changeCoverImage/:eventId",
    allowedToArtist(),
    permissionValidate,
    meEventValidation,
    validationMiddleware,
    uploadCoverImage,
    uploadToHost,
    changeCoverImage,
)

router.route("/")
    .post(
        allowedToArtist(),
        permissionValidate,
        uploadCoverImage,
        createEventValidation,
        validationMiddleware,
        uploadToHost,
        createEvent,
    )
    .get(
        allowedToUser(),
        allowedToAdmins("IT"),
        permissionValidate,
        getEvents,
    );

router.route("/:id")
    .get(
        allowedToUser(),
        allowedToAdmins("IT"),
        permissionValidate,
        getEventValidation,
        validationMiddleware,
        getEvent,
    )
    .patch(
        allowedToAdmins("IT"),
        permissionValidate,
        updateEventValidation,
        validationMiddleware,
        updateEvent,
    )
    .delete(
        allowedToAdmins("IT"),
        permissionValidate,
        deleteEventValidation,
        validationMiddleware,
        deleteEvent,
    )

router.get("/search",
    allowedToAdmins("IT"),
    permissionValidate,
    searchValidation,
    validationMiddleware,
    search,
)

module.exports = router;