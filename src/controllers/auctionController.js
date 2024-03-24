const {v2: cloudinary} = require("cloudinary");

const asyncHandler = require("../middlewares/asyncHandler");
const {uploadMixOfImage} = require("../middlewares/cloudinaryUploadImage");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {allAuctionData, productFromAuctionData} = require("../utils/responseModelData")
const {getSocketIO} = require("../middlewares/socketIO")
const AuctionModel = require("../models/auctionModel")

const uploadProductImages = uploadMixOfImage([
        {name: "coverImage", maxCount: 1},
        {name: "images", maxCount: 8},
    ],
    "product",
)

const uploadToHost = asyncHandler(async (req, res, next) => {
    if (req.files.coverImage) {
        const coverImageOptions = {
            folder: "product-auction",
            public_id: req.files.coverImage[0].filename,
            use_filename: true,
            resource_type: "image",
            format: "jpg",
        };

        req.body.coverImage = await cloudinary.uploader.upload(req.files.coverImage[0].path, coverImageOptions);
    }

    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async image => {
                console.log(image)
                const imagesOptions = {
                    folder: "product-auction",
                    public_id: image.filename,
                    use_filename: true,
                    resource_type: "image",
                    format: "jpg",
                };

                const imageName = await cloudinary.uploader.upload(image.path, imagesOptions);
                req.body.images.push(imageName);
            })
        )
    }

    next();
});

const auctionSubscription = asyncHandler(async (req, res) => {
    await AuctionModel.create({artist: req.loggedUser._id});

    return res.status(201).json(
        apiSuccess(
            `Auction Subscription successfully..`,
            201,
            null,
        ));
});

const addProductToActions = asyncHandler(async (req, res) => {
    const began = new Date(`${req.body.began}`);

    req.body.artist = req.loggedUser._id;
    req.body.end = began.setDate(began.getDate() + +req.body.duration);

    await AuctionModel.create(req.body);

    return res.status(201).json(
        apiSuccess(
            `product added successfully to your auction..`,
            201,
            null,
        ));
});

const removeProductFromActions = asyncHandler(async (req, res) => {
    const {productId} = req.params;

    const product = await AuctionModel.findByIdAndDelete(productId);

    const images = [...(product.images)]
    images.push(product.coverImage);

    for (let image in images) {
        await cloudinary.uploader.destroy(image.public_id);
    }

    return res.status(200).json(
        apiSuccess(
            "product deleted successfully",
            200,
            null,
        ));
});

const updateProductFromSpecificAuction = asyncHandler(async (req, res) => {
    const {productId} = req.params;

    const product = await AuctionModel.findByIdAndUpdate(productId, {
        title: req.body.title,
        description: req.body.description,
        finalPrice: req.body.finalPrice,
        isAvailable: req.body.isAvailable,
        category: req.body.category,
        style: req.body.style,
        subject: req.body.subject,
        material: req.body.material,
        height: req.body.height,
        width: req.body.width,
        depth: req.body.depth,
        duration: req.body.duration,
        began: req.body.began,
    }, {new: true})

    if (req.body.duration) {
        const began = new Date(`${product.began}`);

        product.end = began.setDate(began.getDate() + req.body.duration);
        await product.save();
    }

    if (req.body.began) {
        const began = new Date(`${req.body.began}`);

        product.end = began.setDate(began.getDate() + req.body.duration);
        await product.save();
    }

    return res.status(200).json(
        apiSuccess(
            "product updated successfully",
            200,
            null,
        ));
});

const getAuctions = asyncHandler(async (req, res, next) => {
    const auctionsCount = await AuctionModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(auctionsCount / limit);
    pagination.totalResults = auctionsCount;
    if (endIndex < auctionsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }


    const auctions = await AuctionModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy);

    if (!auctions) {
        return next(new ApiError(`No auctions found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `auctions Found`,
            200,
            {
                pagination,
                auctions: allAuctionData(auctions),
                // auctions,
            }
        ));
});

const getProductOfAuction = asyncHandler(async (req, res) => {
    const {productId} = req.params;

    const auction = await AuctionModel.findById(productId);

    return res.status(200).json(
        apiSuccess(
            "auction found successfully",
            200,
            productFromAuctionData(auction),
        ));
});

const getProductsFromSpecificAuction = asyncHandler(async (req, res, next) => {
    const {artistId} = req.params;

    const auctionsCount = await AuctionModel.countDocuments({artist: artistId});
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(auctionsCount / limit);
    pagination.totalResults = auctionsCount;
    if (endIndex < auctionsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }

    const auctions = await AuctionModel
        .find({artist: artistId})
        .limit(limit)
        .skip(skip)
        .sort(sortBy);

    if (!auctions) {
        return next(new ApiError(`No auctions found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `auctions Found`,
            200,
            {
                pagination,
                auctions: allAuctionData(auctions),
            }
        ));
});

const setProfileID = asyncHandler(async (req, res, next) => {
    req.params.artistId = req.loggedUser._id;
    next();
});

const changeCoverImage = asyncHandler(async (req, res, next) => {
    const {coverImage} = req.body;

    const product = await AuctionModel.findOneAndUpdate(req.params.productId, {coverImage});

    if (!product) {
        return next(new ApiError(`No product found`, 404));
    }

    if (product.coverImage.publicId) {
        await cloudinary.uploader.destroy(product.coverImage.publicId);
    }

    return res.status(200).json(
        apiSuccess(
            "Cover Image updated successfully",
            200,
            null,
        ));
});

const changeSpecificImage = asyncHandler(async (req, res, next) => {
    const {images, publicId} = req.body;
    const {productId} = req.params

    const product = await AuctionModel.findById(productId);

    if (!product) {
        return next(new ApiError(`No product found`, 404));
    }

    const index = product.images.findIndex(image => image.public_id === publicId)

    if (index > -1) {
        product.images[index] = images[0];

        await cloudinary.uploader.destroy(publicId);

        await product.save();
    } else {
        return next(new ApiError(`something went wrong please try again`, 500));
    }

    return res.status(200).json(
        apiSuccess(
            "Image updated successfully",
            200,
            null,
        ));
})

const updatePrice = asyncHandler(async (req, res) => {
    const {finalPrice} = req.body;
    const {productId} = req.params

    await AuctionModel.findByIdAndUpdate(productId, {
        finalPrice: finalPrice,
        finalUser: req.loggedUser._id,
        $addToSet: {
            lastPrices: {
                user: req.loggedUser._id,
                price: finalPrice
            }
        }
    }, {new: true});

    getSocketIO().emit("Bid", {
        user: req.loggedUser._id,
        price: finalPrice
    });

    return res.status(200).json(
        apiSuccess(
            "update price successfully",
            200,
            null,
        ));
});

module.exports = {
    uploadProductImages,
    uploadToHost,
    auctionSubscription,
    addProductToActions,
    removeProductFromActions,
    updateProductFromSpecificAuction,
    getAuctions,
    getProductOfAuction,
    setProfileID,
    getProductsFromSpecificAuction,
    updatePrice,
    changeCoverImage,
    changeSpecificImage,
}