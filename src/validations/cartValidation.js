const {param, body} = require("express-validator");

const ApiError = require("../utils/apiError");
const CartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");

exports.addProductToCartValidation = [
    body("productId")
        .notEmpty()
        .withMessage("Product is required")
        .isMongoId()
        .withMessage("product id not valid")
        .custom((productId) =>
            ProductModel.findById(productId).then((product) => {
                if (!product) {
                    return Promise.reject(new ApiError(`No product for this id: ${product}`, 404));
                }
            })
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