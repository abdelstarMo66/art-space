const express = require('express');

const {
    getAllArtists,
    getArtist,
    updateArtist,
    deleteArtist,
    uploadProfileImage,
    resizeProfileImage,
    changePassword,
    search,
    getArtistProfile,
    updateProfile,
    addArtistAddress,
    getProfileAddresses,
    removeArtistAddress,
} = require("../controllers/artistController")
const {
    getArtistValidation,
    updateArtistValidation,
    deleteArtistValidation,
    changeArtistPasswordValidation,
    searchValidation,
    updateProfileValidation,
} = require("../validations/artistValidation");
const validationMiddleware = require("../middlewares/validationMiddleware");
const verifyToken = require("../middlewares/verifyToken");
const {allowedToAdmins, allowedToArtist, permissionValidate} = require("../middlewares/allowTo");
const {addUserAddressValidation} = require("../validations/userValidation");

const router = express.Router();

router.use(verifyToken);

router.get("/getProfile",
    allowedToArtist(),
    permissionValidate,
    getArtistProfile,
    getArtist,
);

router.patch("/updateProfile",
    allowedToArtist(),
    permissionValidate,
    uploadProfileImage,
    updateProfileValidation,
    validationMiddleware,
    resizeProfileImage,
    updateProfile,
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
        addUserAddressValidation,
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

router.get("/", allowedToAdmins("IT"), permissionValidate, getAllArtists,);

router.get("/search", allowedToAdmins("IT"), permissionValidate, searchValidation, validationMiddleware, search,)

router.route("/:id")
    .get(allowedToAdmins("IT"), permissionValidate, getArtistValidation, validationMiddleware, getArtist)
    .patch(allowedToAdmins("IT"), permissionValidate, uploadProfileImage, updateArtistValidation, validationMiddleware, resizeProfileImage, updateArtist)
    .delete(allowedToAdmins("IT"), allowedToArtist(), permissionValidate, deleteArtistValidation, validationMiddleware, deleteArtist);


module.exports = router