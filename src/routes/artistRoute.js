const express = require('express');

const {
    getAllArtists,
    getArtist,
    updateArtist,
    deleteArtist,
    uploadProfileImage,
    uploadToHost,
    changePassword,
    search,
    setProfileID,
    addArtistAddress,
    getProfileAddresses,
    removeArtistAddress,
    updateProfileImage,
    getArtistInfo,
} = require("../controllers/artistController")
const {
    getArtistValidation,
    updateArtistValidation,
    deleteArtistValidation,
    changeArtistPasswordValidation,
    searchValidation,
    addArtistAddressValidation,
} = require("../validations/artistValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, allowedToArtist,allowedToUser, permissionValidate} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.get("/getProfile",
    allowedToArtist(),
    permissionValidate,
    setProfileID,
    getArtist,
);

router.patch("/updateProfile",
    allowedToArtist(),
    permissionValidate,
    setProfileID,
    updateArtistValidation,
    validationMiddleware,
    updateArtist,
);

router.put("/updateImage",
    allowedToArtist(),
    permissionValidate,
    setProfileID,
    uploadProfileImage,
    uploadToHost,
    updateProfileImage,
);

router.delete("/deleteProfile",
    allowedToArtist(),
    permissionValidate,
    setProfileID,
    deleteArtist,
);

router.patch("/changePassword",
    allowedToArtist(),
    permissionValidate,
    changeArtistPasswordValidation,
    validationMiddleware,
    changePassword,
)

router.route("/address")
    .post(
        allowedToArtist(),
        permissionValidate,
        addArtistAddressValidation,
        validationMiddleware,
        addArtistAddress
    )
    .get(
        allowedToArtist(),
        permissionValidate,
        getProfileAddresses,
    )

router.delete("/address/:addressId",
    allowedToArtist(),
    permissionValidate,
    removeArtistAddress,
)

router.get("/info/:id", allowedToUser(), permissionValidate, getArtistInfo);

router.get("/", allowedToAdmins("IT"), permissionValidate, getAllArtists);

router.get("/search", allowedToAdmins("IT"), permissionValidate, searchValidation, validationMiddleware, search)

router.route("/:id")
    .get(allowedToAdmins("IT"), permissionValidate, getArtistValidation, validationMiddleware, getArtist)
    .patch(allowedToAdmins("IT"), permissionValidate, updateArtistValidation, validationMiddleware, updateArtist)
    .delete(allowedToAdmins("IT"), permissionValidate, deleteArtistValidation, validationMiddleware, deleteArtist);

module.exports = router