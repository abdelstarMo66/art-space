const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const generateJWT = require("../utils/generateJWT");
const ArtistModel = require("../models/artistModel");

const getAllArtists = asyncHandler(async (req, res, next) => {
    const artistsCount = await ArtistModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(artistsCount / limit);
    pagination.totalResults = artistsCount;
    if (endIndex < artistsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt";
    if (req.query.sort) {
        sortBy = req.query.sort.split(",").join(" ");
    }

    const selectedField = "name email phone addresses gender accountActive";

    const artists = await ArtistModel.find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(selectedField);

    if (!artists) {
        return next(new ApiError(`No Artists Found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `Artists Found`,
            200,
            {
                pagination,
                artists,
            }
        ));
});

const getArtist = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const selectedField = "name email phone profileImg addresses gender accountActive";

    const artist = await ArtistModel.findById(id, selectedField);

    if (!artist) {
        return next(new ApiError(`No Artist for this Id ${id}`, 404));
    }

    return res
        .status(200)
        .json(apiSuccess("Artist Found Successfully", 200, artist));
});

const updateArtist = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await ArtistModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        gender: req.body.gender,
    }, {
        new: true,
    });

    return res
        .status(200)
        .json(apiSuccess(`Artist Updated Successfully`, 200, null));
});

const uploadProfileImage = uploadSingleImage("profileImg", "artist");

const uploadToHost = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const options = {
            folder: "artist",
            public_id: req.file.filename,
            use_filename: true,
            resource_type: "image",
            format: "jpg",
        };

        req.body.profileImg = await cloudinary.uploader.upload(req.file.path, options);
    }
    next();
});

const updateProfileImage = asyncHandler(async (req, res) => {
    const artist = await ArtistModel.findByIdAndUpdate(req.loggedUser._id, {profileImg: req.body.profileImg});

    await cloudinary.uploader.destroy(artist.profileImg.public_id);

    return res.status(200).json(
        apiSuccess(
            "Profile Image Updated Successfully",
            200,
            null,
        ));
});

const search = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;

    const queryObj = {};
    queryObj.$or = [
        {name: {$regex: keyword, $options: "i"}},
        {email: {$regex: keyword, $options: "i"}},
        {phone: {$regex: keyword, $options: "i"}},
        {gender: {$regex: keyword, $options: "i"}},
        {address: {$regex: keyword, $options: "i"}}
    ];

    const selectedField = "name email phone profileImg addresses gender accountActive";

    const artists = await ArtistModel.find(queryObj, selectedField);

    if (!artists) {
        return next(new ApiError(`No Artists Found Matched this Search Key: ${keyword}`, 404));
    }

    return res.status(200).json(apiSuccess(`Artists Found`, 200, artists));
});

const deleteArtist = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const artist = await ArtistModel.findByIdAndDelete(id);

    await cloudinary.uploader.destroy(artist.profileImg.public_id);

    return res
        .status(200)
        .json(apiSuccess(`Artist Deleted Successfully`, 200, null));
});

const setProfileID = asyncHandler(async (req, res, next) => {
    req.params.id = req.loggedUser._id;
    next();
});

const changePassword = asyncHandler(async (req, res) => {
    const id = req.loggedUser._id;

    const artist = await ArtistModel.findByIdAndUpdate(id, {
        password: await bcrypt.hash(req.body.password, 12), passwordChangedAt: Date.now(),
    }, {
        new: true,
    });

    const token = await generateJWT({id: artist._id, role: "artist"});

    return res
        .status(200)
        .json(apiSuccess(`Password Changed Successfully`, 200, {token}));
});

const addArtistAddress = asyncHandler(async (req, res) => {
    const artist = await ArtistModel.findById(req.loggedUser._id);

    for (let i = 0; i < artist.addresses.length; i++) {
        if (JSON.stringify(req.body) === JSON.stringify(artist.addresses[i], ["alias", "street", "region", "city", "country", "postalCode", "phone",])
            || JSON.stringify(req.body) === JSON.stringify(artist.addresses[i], ["alias", "street", "region", "city", "country", "postalCode",])
            || JSON.stringify(req.body) === JSON.stringify(artist.addresses[i], ["alias", "street", "region", "city", "country", "phone",]) || JSON.stringify(req.body) === JSON.stringify(artist.addresses[i], ["alias", "street", "region", "city", "country",])) {
            return res
                .status(200)
                .json(apiSuccess("This Address is Already in the List of Addresses", 200, null));
        }
    }

    await artist.updateOne({
        $addToSet: {addresses: req.body},
    }, {new: true});

    return res
        .status(201)
        .json(apiSuccess("Address Added Successfully", 200, null));
});

const removeArtistAddress = asyncHandler(async (req, res) => {
    const {addressId} = req.params;

    const artist = await ArtistModel.findByIdAndUpdate(req.loggedUser._id, {
        $pull: {addresses: {_id: addressId}},
    }, {new: true});

    return res
        .status(200)
        .json(apiSuccess("Address Removed Successfully", 200, artist.addresses));
});

const getProfileAddresses = asyncHandler(async (req, res) => {
    const artist = await ArtistModel.findById(req.loggedUser._id).populate("addresses");

    return res
        .status(200)
        .json(apiSuccess("Address Founded Successfully", 200, {address: artist.addresses}));
});

module.exports = {
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
    removeArtistAddress,
    getProfileAddresses,
    updateProfileImage
};
