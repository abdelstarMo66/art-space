const fs = require("fs");

const sharp = require("sharp");
const bcrypt = require("bcrypt");

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadSingleImage} = require("../middlewares/uploadImageMiddleware");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const ArtistModel = require("../models/artistModel");
const generateJWT = require("../utils/generateJWT");

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

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = this.queryString.sort.split(',').join(" ");
    }

    let limitField = "-__v -password";
    if (req.query.fields) {
        limitField = this.queryString.fields.split(",").join(" ");
    }

    const artists = await ArtistModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(limitField);

    if (!artists) {
        return next(new ApiError(`No artists found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `artists Found`,
            200,
            {
                pagination,
                artists
            }
        ));
});

const getArtist = asyncHandler(async (req, res, next) => {
    const {id} = req.params;

    const artist = await ArtistModel.findById(id, "-password -__v");

    if (!artist) {
        return next(new ApiError(`no artist for this id ${id}`, 404))
    }

    return res.status(200).json(
        apiSuccess(
            "artist found successfully",
            200,
            {artist}
        ));
});

const uploadProfileImage = uploadSingleImage("profileImg");

const resizeProfileImage = asyncHandler(async (req, res, next) => {
    const fileName = `artist-${Math.round(
        Math.random() * 1e9
    )}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({quality: 95})
            .toFile(`uploads/artists/${fileName}`)
            .then(async () => {
                const artist = await ArtistModel.findById(req.params.id);
                const oldFileName = artist.profileImg;
                const filePath = `uploads/artists/${oldFileName}`;
                fs.access(filePath, fs.constants.F_OK, (err) => {
                    if (!err) {
                        // File exists, so delete it
                        fs.unlink(filePath, (deleteErr) => {
                            if (deleteErr) {
                                console.error('Error deleting file:', deleteErr);
                            }
                        });
                    }
                });
            });

        req.body.profileImg = fileName;
    }
    next();
});

const updateArtist = asyncHandler(async (req, res) => {
    const {id} = req.params;

    await ArtistModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        profileImg: req.body.profileImg,
    }, {
        new: true,
    });

    return res.status(200).json(
        apiSuccess(
            `artist updated successfully`,
            200,
            null
        ));

});

const search = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;

    const queryObj = {};
    queryObj.$or = [
        {name: {$regex: keyword, $options: "i"}},
        {email: {$regex: keyword, $options: "i"},},
        {phone: {$regex: keyword, $options: "i"},},
        {gender: {$regex: keyword, $options: "i"},},
        {address: {$regex: keyword, $options: "i"},}
    ]

    const artists = await ArtistModel.find(queryObj, "-password -__v");

    if (!artists) {
        return next(new ApiError(`No artists found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `artists Found`,
            200,
            {artists}
        ));
});

const deleteArtist = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const artist = await ArtistModel.findByIdAndDelete(id);

    const oldFileName = artist.profileImg;
    const filePath = `uploads/artists/${oldFileName}`;
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            // File exists, so delete it
            fs.unlink(filePath, (deleteErr) => {
                if (deleteErr) {
                    console.error('Error deleting file:', deleteErr);
                }
            });
        }
    });

    return res.status(200).json(
        apiSuccess(
            `artist deleted successfully`,
            200,
            null
        ));

});

const getArtistProfile = asyncHandler(async (req, res, next) => {
    req.params.id = req.loggedUser._id;
    next();
});

const changePassword = asyncHandler(async (req, res) => {
    const id = req.loggedUser._id;

    const artist = await ArtistModel.findByIdAndUpdate(
        id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );

    const token = await generateJWT({id: artist._id, role: "artist"});

    return res.status(200).json(
        apiSuccess(
            `password changed successfully`,
            200,
            {token}
        ));
})

const updateProfile = asyncHandler(async (req, res) => {
    const id = req.loggedUser._id;

    await ArtistModel.findByIdAndUpdate(id, {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        profileImg: req.body.profileImg,
    }, {
        new: true,
    });

    return res.status(200).json(
        apiSuccess(
            `artist updated successfully`,
            200,
            null
        ));

});

module.exports = {
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
}