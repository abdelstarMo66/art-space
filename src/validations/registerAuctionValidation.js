const {param} = require("express-validator");

const ApiError = require("../utils/apiError");
const AuctionModel = require("../models/auctionModel");
const RegisterAuctionModel = require("../models/registerAuctionModel");

exports.registerToAuctionValidation = [
    param("auctionId")
        .isMongoId()
        .withMessage("invalid auction id")
        .custom(async (val, {req}) => {
            const product = await AuctionModel.findById(val);

            if (!product) {
                return Promise.reject(new ApiError(`no product found for this id ${val}`, 404));
            }

            const check = await RegisterAuctionModel.find({
                user: req.loggedUser._id,
                auction: {$in: [{auctionId: val}]}
            });

            if (check.length > 0) {
                return Promise.reject(new ApiError(`you are already registered in this auction`, 400));
            }

            return true;
        }),
]