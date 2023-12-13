const multer = require("multer");

const ApiError = require("../utils/apiError");

const multerOptions = () => {

    const multerStorage = multer.memoryStorage();

    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new ApiError("only image allowed", 400), false);
        }
    };

    return multer({storage: multerStorage, fileFilter: multerFilter});
};

const uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

const uploadMixOfImage = (arrOfFields) => multerOptions().fields(arrOfFields);

module.exports = {uploadSingleImage, uploadMixOfImage};
