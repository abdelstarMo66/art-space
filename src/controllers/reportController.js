const PDFDocument = require("pdfkit-table");

const asyncHandler = require("../middlewares/asyncHandler")
const apiSuccess = require("../utils/apiSuccess");
const {allCategoryData} = require("../utils/responseModelData");
const CategoryModel = require("../models/categoryModel")
const sendEmail = require("../utils/sendEmail");

const getAvailableProductReport = asyncHandler(async (req, res) => {
    let doc = new PDFDocument({margin: 30, size: 'A4'});

    const categories = await CategoryModel.find();
    const availableCategories = [];

    for (const category of categories){
        availableCategories.push({
            id: category._id.toString(),
            title: category.title,
        });
    }
    console.log(availableCategories)

    await (async function () {
        // table
        const table = {
            title: "Available Categories",
            subtitle: "This is all categories available for your application",
            headers: [
                {label: "Id", property: 'id', width: 160, renderer: null},
                {label: "Title", property: 'title', width: 150, renderer: null},
            ],
            datas: availableCategories,
        };

        // the magic
        doc.table(table, {
            prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                doc.font("Helvetica").fontSize(10);
                indexColumn === 0 && doc.addBackground(rectRow, 'blue', 0.15);
            },
        });
        // done!
        console.log("Done");

        console.log("Send Email");
        doc.end();
    })();

    sendEmail({
        email: "mohamedabdelstar30@gmail.com",
        subject: "Activating Your Account (valid for 10 minutes)",
        text: "Report ready to download",
        data: doc,
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
