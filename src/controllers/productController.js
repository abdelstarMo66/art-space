const asyncHandler = require("../middlewares/asyncHandler");
const sharp = require("sharp");

const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {uploadMixOfImage} = require("../middlewares/uploadImageMiddleware");
const ProductModel = require("../models/productModel");
const fs = require("fs");

const uploadProductImages = uploadMixOfImage([
    {name: "coverImage", maxCount: 1},
    {name: "images", maxCount: 8},
]);

const resizeProductImage = asyncHandler(async (req, res, next) => {
    if (req.files.coverImage) {
        const imageCoverFileName = `products-${Math.round(
            Math.random() * 1e9
        )}-${Date.now()}-cover.jpeg`;

        await sharp(req.files.coverImage[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({quality: 95})
            .toFile(`uploads/products/${imageCoverFileName}`);

        req.body.coverImage = imageCoverFileName;
    }

    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (image, index) => {
                const imageName = `products-${Math.round(
                    Math.random() * 1e9
                )}-${Date.now()}-${index}.jpeg`;

                await sharp(image.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({quality: 90})
                    .toFile(`uploads/products/${imageName}`);

                req.body.images.push(imageName);
            })
        );
    }

    next();
});

const createProduct = asyncHandler(async (req, res) => {
    req.body.owner = req.loggedUser._id;
    await ProductModel.create(req.body);

    return res.status(201).json(
        apiSuccess(
            `add product successfully..`,
            201,
            null,
        ));
});

const getProducts = asyncHandler(async (req, res, next) => {
    const productsCount = await ProductModel.countDocuments();
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(productsCount / limit);
    pagination.totalResults = productsCount;
    if (endIndex < productsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }

    let limitField = "-__v";
    if (req.query.fields) {
        limitField = req.query.fields.split(",").join(" ");
    }

    const products = await ProductModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(limitField);

    if (!products) {
        return next(new ApiError(`No products found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `products Found`,
            200,
            {
                pagination,
                products
            }
        ));
});

const getProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const product = await ProductModel.findById(id);

    return res.status(200).json(
        apiSuccess(
            "product found successfully",
            200,
            {product},
        ));
});

const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const product = await ProductModel.findByIdAndUpdate(id,
        {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            isAvailable: req.body.isAvailable,
            category: req.body.category,
            style: req.body.style,
            subject: req.body.subject,
            material: req.body.material,
            height: req.body.height,
            width: req.body.width,
            depth: req.body.depth,
            coverImage: req.body.coverImage,
        },
        {new: true},
    );

    return res.status(200).json(
        apiSuccess(
            "product updated successfully",
            200,
            {product},
        ));

});

const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const product = await ProductModel.findByIdAndDelete(id);

    const images = [...(product.images)]
    images.push(product.coverImage);

    for (let oldFileName in images) {
        const filePath = `uploads/products/${oldFileName}`;
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
    }


    return res.status(200).json(
        apiSuccess(
            "product deleted successfully",
            200,
            null,
        ));
});

const search = asyncHandler(async (req, res, next) => {
    const {keyword} = req.query;

    const queryObj = {};
    queryObj.$or = [
        {title: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"},},
        {owner: {$regex: keyword, $options: "i"},},
        {category: {$regex: keyword, $options: "i"},},
        {style: {$regex: keyword, $options: "i"},},
        {subject: {$regex: keyword, $options: "i"},},
        {material: {$regex: keyword, $options: "i"},},
    ]

    const products = await ProductModel.find(queryObj, "-__v");

    if (!products) {
        return next(new ApiError(`No products found matched this search key: ${keyword}`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `products Found`,
            200,
            {products}
        ));
});

const getMeProducts = asyncHandler(async (req, res, next) => {
    const productsCount = await ProductModel.countDocuments({owner: req.loggedUser._id});
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 20;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    // pagination results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numbersOfPages = Math.ceil(productsCount / limit);
    pagination.totalResults = productsCount;
    if (endIndex < productsCount) {
        pagination.nextPage = page + 1;
    }
    if (skip > 0) {
        pagination.previousPage = page - 1;
    }

    let sortBy = "createdAt"
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(" ");
    }

    let limitField = "-__v";
    if (req.query.fields) {
        limitField = req.query.fields.split(",").join(" ");
    }

    const products = await ProductModel
        .find({owner: req.loggedUser._id})
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select(limitField);

    if (!products) {
        return next(new ApiError(`No products found`, 404));
    }

    return res.status(200).json(
        apiSuccess(
            `products Found`,
            200,
            {
                pagination,
                products
            }
        ));
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    search,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    resizeProductImage,
    getMeProducts,
}