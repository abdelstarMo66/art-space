const {param, body} = require("express-validator");

const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");

exports.addProductToCartValidation = [
    body("productId")
        .notEmpty()
        .withMessage("Product is required")
        .isMongoId()
        .withMessage("product id not valid")
        .custom(async (productId) => {
                const product = await ProductModel.findById(productId)

                if (!product) {
                    return Promise.reject(new ApiError(`No product for this id: ${product}`, 404));
                }

                if (!product.isAvailable) {
                    return Promise.reject(new ApiError(`this product not available`, 404));
                }

                return true;
            }
        ),
]

exports.deleteSpecificProductFromCartValidation = [
    param("itemId")
        .isMongoId()
        .withMessage("Invalid Cart Id")
        .custom(async (val) => {
            const product = await ProductModel.findById(val);

            if (!product) {
                return Promise.reject(new ApiError(`this product can't allowed to delete`, 404));
            }
            return true;
        }),
]