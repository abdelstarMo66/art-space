const fs = require('fs');
const {stringify} = require("csv-stringify")

const asyncHandler = require("../middlewares/asyncHandler")
const apiSuccess = require("../utils/apiSuccess");
const {availableProductReport} = require("../utils/responseModelData");
const ProductModel = require("../models/productModel")
const sendEmail = require("../utils/sendEmail");

const getAvailableProductReport = asyncHandler(async (req, res) => {
    const filename = "output.csv";
    const writableStream = fs.createWriteStream(filename);

    const columns = ["id", "title", "description", "price", "owner", "category", "style", "subject", "material", "height", "width", "depth", "inEvent"];

    const stringifier = stringify({header: true, columns: columns});

    const products = await ProductModel.find();

    for (const product of products) {
        stringifier.write(availableProductReport(product));
    }

    stringifier.pipe(writableStream)

    stringifier.end();

    fs.readFile(filename, function (err, data) {
        sendEmail({
            email: "mohamedabdelstar30@gmail.com",
            subject: "Activating Your Account (valid for 10 minutes)",
            text: "Report ready to download",
            data: data,
        });
    });

    fs.unlink(filename, function () {
        console.log('successfully deleted file');
    });

    res.status(200).json(apiSuccess(
        "All product report generated successfully",
        200,
        null,
    ));
});

module.exports = {
    getAvailableProductReport,
}
