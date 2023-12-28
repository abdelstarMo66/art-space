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
const {allowedToAdmins, allowedToArtist} = require("../middlewares/allowTo");

const router = express.Router();

router.use(verifyToken);

router.get("/getProfile",
    allowedToArtist(),
    getArtistProfile,
    getArtist,
);

router.patch("/updateProfile",
    allowedToArtist(),
    uploadProfileImage,
    updateProfileValidation,
    validationMiddleware,
    resizeProfileImage,
    updateProfile,
);

router.patch("/changePassword",
    allowedToArtist(),
    changeArtistPasswordValidation,
    validationMiddleware,
    changePassword,
)

router.get("/",
    allowedToAdmins("IT"),
    getAllArtists,
);

router.get("/search",
    allowedToAdmins("IT"),
    searchValidation,
    validationMiddleware,
    search,
)

router.route("/:id")
    .get(allowedToAdmins("IT"), getArtistValidation, validationMiddleware, getArtist)
    .patch(allowedToAdmins("IT"), uploadProfileImage, updateArtistValidation, validationMiddleware, resizeProfileImage, updateArtist)
    .delete(allowedToAdmins("IT"), allowedToArtist(), deleteArtistValidation, validationMiddleware, deleteArtist);


module.exports = router