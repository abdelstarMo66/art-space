const asyncHandler = require("../middlewares/asyncHandler");
const ExcelJS = require('exceljs');
const cloudinary = require("cloudinary").v2;
const stream = require('stream');

const testingController = asyncHandler(async (req, res, next) => {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');

    // Add some data to the worksheet
    worksheet.columns = [
        {header: 'Id', key: 'id', width: 10},
        {header: 'Name', key: 'name', width: 30},
        {header: 'Age', key: 'age', width: 10},
    ];

    worksheet.addRow({id: 1, name: 'John Doe', age: 30});
    worksheet.addRow({id: 2, name: 'Jane Smith', age: 25});

    // Create a buffer from the workbook
    const buffer = await workbook.xlsx.writeBuffer();

    // Convert buffer to a readable stream
    const readableStream = new stream.PassThrough();
    readableStream.end(buffer);

    // Upload the Excel file to Cloudinary
    cloudinary.uploader.upload_stream(
        {
            resource_type: 'raw',
            folder: 'excel-files',
            use_filename: true,
            format: "xlsx",
        },
        (error, result) => {
            if (error) {
                console.error('Upload to Cloudinary failed:', error);
            } else {
                console.log('Upload to Cloudinary successful:', result);
            }
        }
    ).end(buffer);
});

module.exports = {testingController}