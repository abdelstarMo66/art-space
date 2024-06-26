const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadSingleImage} = require("../middlewares/cloudinaryUploadImage");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const generateJWT = require("../utils/generateJWT");
const {
    artistData,
    allArtistData,
    allAddresses,
    allProductData,
    allEventData,
    allAuctionData
} = require("../utils/responseModelData");
const ApiFeatures = require("../utils/apiFeatures");
const ArtistModel = require("../models/artistModel");
const ProductModel = require("../models/productModel");
const EventModel = require("../models/eventModel");
const AuctionModel = require("../models/auctionModel");

const getAllArtists = asyncHandler(async (req, res, next) => {
    const artistsCount = await ArtistModel.countDocuments();

    const apiFeatures = new ApiFeatures(ArtistModel.find(), req.query)
        .paginate(artistsCount)
        .filter()
        .sort()

    const {paginationResult, mongooseQuery} = apiFeatures;

    const artists = await mongooseQuery;

    if (!artists) {
        return next(new ApiError(`No Artists Found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `Artists Found`,
            200,
            {
                pagination: paginationResult,
                artists: allArtistData(artists),
            }
        ));
});

const getArtist = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const artist = await ArtistModel.findById(id);

    if (!artist) {
        return next(new ApiError(`No Artist for this Id ${id}`, 404));
    }

    return res
        .status(200)
        .json(apiSuccess(
            "Artist Found Successfully",
            200,
            artistData(artist)
        ));
});

const updateArtist = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await ArtistModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        bio: req.body.bio,
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

    if (artist.profileImg.public_id) {
        await cloudinary.uploader.destroy(artist.profileImg.public_id);
    }

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

    const artists = await ArtistModel.find(queryObj);

    if (!artists) {
        return next(new ApiError(`No Artists Found Matched this Search Key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `Artists Found`,
            200,
            {
                artists: allArtistData(artists),
            }
        ));
});

const deleteArtist = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const artist = await ArtistModel.findByIdAndDelete(id);

    if (artist.profileImg.public_id) {
        await cloudinary.uploader.destroy(artist.profileImg.public_id);
    }

    const products = await ProductModel.find({owner: id});

    for (const oneProduct of products) {
        const product = await ProductModel.findByIdAndDelete(oneProduct._id);

        const images = [...(product.images)]
        images.push(product.coverImage);

        for (let image of images) {
            if (image.public_id) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }
    }

    const events = await EventModel.find({owner: id});

    for (const event of events) {
        await EventModel.findByIdAndDelete(event._id);

        if (event.coverImage.public_id) {
            await cloudinary.uploader.destroy(event.coverImage.public_id);
        }

    }

    const auctions = await AuctionModel.find({artist: id});


    for (const auction of auctions) {
        const product = await AuctionModel.findByIdAndDelete(auction._id);

        const images = [...(product.images)]
        images.push(product.coverImage);

        for (let image of images) {
            if (image.public_id) {
                await cloudinary.uploader.destroy(image.public_id);
            }
        }
    }

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
        .json(apiSuccess(
            "Address Removed Successfully",
            200,
            {addresses: allAddresses(artist.addresses)}
        ));
});

const getProfileAddresses = asyncHandler(async (req, res) => {
    const artist = await ArtistModel.findById(req.loggedUser._id);

    return res
        .status(200)
        .json(apiSuccess(
            "Address Founded Successfully",
            200,
            {addresses: allAddresses(artist.addresses)}
        ));
});

const getArtistInfo = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const artist = await ArtistModel.findById(id);

    if (!artist) {
        return next(new ApiError(`No Artist for this Id ${id}`, 404));
    }

    const products = await ProductModel.find({owner: id});

    const events = await EventModel.find({owner: id});

    const auctions = await AuctionModel.find({artist: id});

    return res
        .status(200)
        .json(apiSuccess(
            "Artist Found Successfully",
            200,
            {
                artist: artistData(artist),
                products: allProductData(products),
                events: allEventData(events),
                auctions: allAuctionData(auctions),
            }
        ));
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
    updateProfileImage,
    getArtistInfo,
};
