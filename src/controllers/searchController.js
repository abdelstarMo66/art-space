const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("../utils/apiError");
const apiSuccess = require("../utils/apiSuccess");
const {searchData} = require("../utils/responseModelData");
const ArtistModel = require("../models/artistModel");
const ProductModel = require("../models/productModel");
const EventModel = require("../models/eventModel");

const userSearch = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;

    const artistQueryObj = {};
    artistQueryObj.$or = [
        {name: {$regex: keyword, $options: "i"}},
    ]

    const productQueryObj = {};
    productQueryObj.$or = [
        {title: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"},},
        {material: {$regex: keyword, $options: "i"},},
    ]

    const eventQueryObj = {};
    eventQueryObj.$or = [
        {title: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"},},
    ]

    const artists = await ArtistModel.find(artistQueryObj, "name email phone profileImg addresses gender accountActive");

    const products = await ProductModel.find(productQueryObj, "title description price isAvailable owner coverImage");

    const events = await EventModel.find(eventQueryObj, "title description owner duration began");

    if (!artists && !products && !events) {
        return next(new ApiError(`No result found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `result found`,
            200,
            searchData(artists, products, events)
        ));
});

module.exports = {
    userSearch,
}