const asyncHandler = require("../middlewares/asyncHandler")
const {
    availableProductsReport,
    unavailableProductsReport,
    artistStatisticReport,
    singleArtistStatisticReport,
    lastEventsReport,
    lastAuctionsReport,
} = require("../utils/responseModelData");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const {sendDocToEmail} = require("../utils/sendDocToEmail");
const ProductModel = require("../models/productModel");
const ArtistModel = require("../models/artistModel");
const EventModel = require("../models/eventModel");
const AuctionModel = require("../models/auctionModel");
const OrderModel = require("../models/orderModel");

const getAvailableProductsReport = asyncHandler(async (req, res, next) => {
    const {startDate, endDate, numberOfMonth, numberOfYear, sendResultToEmail} = req.query;
    const now = new Date();

    let filterQuery = {
        isAvailable: true,
    }

    if (startDate && endDate) {
        filterQuery = {
            isAvailable: true,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };
    } else if (numberOfMonth) {
        const lastNumberOfMonthAgo = new Date(now.setMonth(now.getMonth() - numberOfMonth));

        filterQuery = {
            isAvailable: true,
            createdAt: {
                $gte: new Date(lastNumberOfMonthAgo),
            }
        };
    } else if (numberOfYear) {
        const lastNumberOfYearAgo = new Date(now.setFullYear(now.getFullYear() - numberOfYear));

        filterQuery = {
            isAvailable: true,
            createdAt: {
                $gte: new Date(lastNumberOfYearAgo),
            }
        };
    }

    const productsCount = await ProductModel.countDocuments(filterQuery);

    const apiFeatures = new ApiFeatures(ProductModel.find(filterQuery), req.query)
        .paginate(productsCount)

    const {paginationResult, mongooseQuery} = apiFeatures;

    const products = await mongooseQuery;

    if (!products) {
        return next(ApiError("not Products found", 404));
    }

    if (sendResultToEmail) {
        if (sendResultToEmail.toString() === "true") {
            await sendDocToEmail(availableProductsReport(products)[0], availableProductsReport(products));

            return res.status(200).json(apiSuccess(
                "All Available product generated successfully in report and send to email",
                200,
                null,
            ));
        }
    }


    return res.status(200).json(apiSuccess(
        "All Available product generated successfully in report",
        200,
        {
            pagination: paginationResult,
            availableProducts: availableProductsReport(products)
        },
    ));
});

const getUnAvailableProductsReport = asyncHandler(async (req, res, next) => {
    const {startDate, endDate, numberOfMonth, numberOfYear, sendResultToEmail} = req.query;
    let unAvailableProductsList = [];
    const now = new Date();

    let filterQuery = {
        isAvailable: false,
    }

    if (startDate && endDate) {
        filterQuery = {
            isAvailable: false,
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };
    } else if (numberOfMonth) {
        const lastNumberOfMonthAgo = new Date(now.setMonth(now.getMonth() - numberOfMonth));

        filterQuery = {
            isAvailable: false,
            createdAt: {
                $gte: new Date(lastNumberOfMonthAgo),
            }
        };
    } else if (numberOfYear) {
        const lastNumberOfYearAgo = new Date(now.setFullYear(now.getFullYear() - numberOfYear));

        filterQuery = {
            isAvailable: false,
            createdAt: {
                $gte: new Date(lastNumberOfYearAgo),
            }
        };
    }

    const productsCount = await ProductModel.countDocuments(filterQuery);

    const apiFeatures = new ApiFeatures(ProductModel.find(filterQuery), req.query)
        .paginate(productsCount)

    const {paginationResult, mongooseQuery} = apiFeatures;

    const products = await mongooseQuery;

    if (!products) {
        return next(ApiError("not Products found", 404));
    }

    for (let product of products) {
        const order = await OrderModel.findOne({"cartItems.product": product._id});

        unAvailableProductsList.push({
            product: product,
            order: order,
        });
    }

    if (sendResultToEmail) {
        if (sendResultToEmail.toString() === "true") {
            await sendDocToEmail(unavailableProductsReport(unAvailableProductsList)[0], unavailableProductsReport(unAvailableProductsList));

            return res.status(200).json(apiSuccess(
                "All Unavailable product generated successfully in report and send to email",
                200,
                null,
            ));
        }
    }

    return res.status(200).json(apiSuccess(
        "All Unavailable product generated successfully in report",
        200,
        {
            pagination: paginationResult,
            unavailableProducts: unavailableProductsReport(unAvailableProductsList)
        },
    ));
});

const getArtistsStatisticReport = asyncHandler(async (req, res) => {
    const {sendResultToEmail} = req.query;
    let artistsStatistic = [];
    const artistsCount = await ArtistModel.countDocuments();

    const apiFeatures = new ApiFeatures(ArtistModel.find(), req.query)
        .paginate(artistsCount)

    const {paginationResult, mongooseQuery} = apiFeatures;

    const artists = await mongooseQuery;

    for (let artist of artists) {
        const products = await ProductModel.countDocuments({owner: artist._id});
        const events = await EventModel.countDocuments({owner: artist._id});
        const auctions = await AuctionModel.countDocuments({artist: artist._id});

        artistsStatistic.push({
            artist: artist,
            products: products,
            events: events,
            auctions: auctions,
        });
    }

    if (sendResultToEmail) {
        if (sendResultToEmail.toString() === "true") {
            await sendDocToEmail(artistStatisticReport(artistsStatistic)[0], artistStatisticReport(artistsStatistic));

            return res.status(200).json(apiSuccess(
                "Artist Statistic generated successfully in report and send to email",
                200,
                null,
            ));
        }
    }

    return res.status(200).json(apiSuccess(
        "Artist Statistic generated successfully in report",
        200,
        {
            pagination: paginationResult,
            artistStatistic: artistStatisticReport(artistsStatistic)
        },
    ));
});

const getSingleArtistStatisticReport = asyncHandler(async (req, res) => {
    const {artistId} = req.params;

    const artist = await ArtistModel.findById(artistId);
    const products = await ProductModel.find({owner: artistId});
    const events = await EventModel.find({owner: artistId});
    const auctions = await AuctionModel.find({artist: artistId});

    return res.status(200).json(apiSuccess(
        `Artist ${artist.name} Statistic generated successfully in report`,
        200,
        singleArtistStatisticReport(artist, products, events, auctions),
    ));
});

const getLastEventsReport = asyncHandler(async (req, res, next) => {
    const {startDate, endDate, numberOfMonth, numberOfYear, sendResultToEmail} = req.query;
    const now = new Date();

    let filterQuery = {}

    if (startDate && endDate) {
        filterQuery = {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };
    } else if (numberOfMonth) {
        const lastNumberOfMonthAgo = new Date(now.setMonth(now.getMonth() - numberOfMonth));

        filterQuery = {
            createdAt: {
                $gte: new Date(lastNumberOfMonthAgo),
            }
        };
    } else if (numberOfYear) {
        const lastNumberOfYearAgo = new Date(now.setFullYear(now.getFullYear() - numberOfYear));

        filterQuery = {
            createdAt: {
                $gte: new Date(lastNumberOfYearAgo),
            }
        };
    }

    const eventsCount = await EventModel.countDocuments(filterQuery);

    const apiFeatures = new ApiFeatures(EventModel.find(filterQuery), req.query)
        .paginate(eventsCount)

    const {paginationResult, mongooseQuery} = apiFeatures;

    const events = await mongooseQuery;

    if (!events) {
        return next(ApiError("not events found", 404));
    }

    if (sendResultToEmail) {
        if (sendResultToEmail.toString() === "true") {
            await sendDocToEmail(lastEventsReport(events)[0], lastEventsReport(events));

            return res.status(200).json(apiSuccess(
                "All Available events generated successfully in report and send to email",
                200,
                null,
            ));
        }
    }

    return res.status(200).json(apiSuccess(
        "All Available events generated successfully in report",
        200,
        {
            pagination: paginationResult,
            availableEvents: lastEventsReport(events)
        },
    ));
});

const getLastAuctionsReport = asyncHandler(async (req, res, next) => {
    const {startDate, endDate, numberOfMonth, numberOfYear, sendResultToEmail} = req.query;
    const now = new Date();

    let filterQuery = {}

    if (startDate && endDate) {
        filterQuery = {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };
    } else if (numberOfMonth) {
        const lastNumberOfMonthAgo = new Date(now.setMonth(now.getMonth() - numberOfMonth));

        filterQuery = {
            createdAt: {
                $gte: new Date(lastNumberOfMonthAgo),
            }
        };
    } else if (numberOfYear) {
        const lastNumberOfYearAgo = new Date(now.setFullYear(now.getFullYear() - numberOfYear));

        filterQuery = {
            createdAt: {
                $gte: new Date(lastNumberOfYearAgo),
            }
        };
    }

    const auctionsCount = await AuctionModel.countDocuments(filterQuery);

    const apiFeatures = new ApiFeatures(AuctionModel.find(filterQuery), req.query)
        .paginate(auctionsCount)

    const {paginationResult, mongooseQuery} = apiFeatures;

    const auctions = await mongooseQuery;

    if (!auctions) {
        return next(ApiError("not auctions found", 404));
    }

    if (sendResultToEmail) {
        if (sendResultToEmail.toString() === "true") {
            await sendDocToEmail(lastAuctionsReport(auctions)[0], lastAuctionsReport(auctions));

            return res.status(200).json(apiSuccess(
                "All Available auctions generated successfully in report and send to email",
                200,
                null,
            ));
        }
    }

    return res.status(200).json(apiSuccess(
        "All Available auctions generated successfully in report",
        200,
        {
            pagination: paginationResult,
            availableAuctions: lastAuctionsReport(auctions)
        },
    ));
});

module.exports = {
    getAvailableProductsReport,
    getUnAvailableProductsReport,
    getArtistsStatisticReport,
    getSingleArtistStatisticReport,
    getLastEventsReport,
    getLastAuctionsReport,
}
