const cloudinary = require("cloudinary").v2;

const asyncHandler = require("../middlewares/asyncHandler");
const apiSuccess = require("../utils/apiSuccess");
const ApiError = require("../utils/apiError");
const {uploadMixOfImage} = require("../middlewares/cloudinaryUploadImage");
const ProductModel = require("../models/productModel");

const uploadProductImages = uploadMixOfImage([
        {name: "coverImage", maxCount: 1},
        {name: "images", maxCount: 8},
    ],
    "product",
)

const uploadToHost = asyncHandler(async (req, res, next) => {
    if (req.files.coverImage) {
        const coverImageOptions = {
            folder: "product",
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
                    folder: "product",
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

    const products = await ProductModel
        .find()
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select("-__v -createdAt -updatedAt");

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

    const products = await ProductModel.find(queryObj, "-__v -createdAt -updatedAt");

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

    const products = await ProductModel
        .find({owner: req.loggedUser._id})
        .limit(limit)
        .skip(skip)
        .sort(sortBy)
        .select("-__v -createdAt -updatedAt");

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

const changeCoverImage = asyncHandler(async (req, res, next) => {
    const {coverImage} = req.body;

    const product = await ProductModel.findOneAndUpdate(req.params.productId, {coverImage});

    if (!product) {
        return next(new ApiError(`No product found`, 404));
    }

    await cloudinary.uploader.destroy(product.coverImage.publicId);

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

    const product = await ProductModel.findById(productId);

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

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    search,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    uploadToHost,
    getMeProducts,
    changeCoverImage,
    changeSpecificImage
}