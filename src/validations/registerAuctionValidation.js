const {param, body, check} = require("express-validator");

const ApiError = require("../utils/apiError");
const AuctionModel = require("../models/auctionModel");
const UserModel = require("../models/userModel");

exports.registerToAuctionValidation = [
    param("auctionId")
        .isMongoId()
        .withMessage("invalid auction id")
        .custom(async (val) => {
            const product = await AuctionModel.findById(val);

            if (!product) {
                return Promise.reject(new ApiError(`no product found for this id ${val}`, 404));
            }
            return true;
        }),
]