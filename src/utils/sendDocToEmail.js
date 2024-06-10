const nodemailer = require("nodemailer");
const ExcelJS = require("exceljs");
const stream = require("stream");
const {v2: cloudinary} = require("cloudinary");

const asyncHandler = require("../middlewares/asyncHandler");
const ApiError = require("./apiError");

const sendDocToEmail = async (doc, data) => {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Doc Sheet');

    const keys = Object.keys(doc);
    const worksheetColumns = [];

    // Add some data to the worksheet
    keys.forEach(key => {
        worksheetColumns.push({header: key, key: key, width: 20})
    })

    worksheet.columns = worksheetColumns


    data.forEach(row => {
        worksheet.addRow(row);
    })

    // Create a buffer from the workbook
    const buffer = await workbook.xlsx.writeBuffer();

    // Convert buffer to a readable stream
    const readableStream = new stream.PassThrough();
    readableStream.end(buffer);

    // // Upload the Excel file to Cloudinary
    // cloudinary.uploader.upload_stream(
    //     {
    //         resource_type: 'raw',
    //         folder: 'reports',
    //         use_filename: true,
    //         format: "xlsx",
    //     },
    //     (error, result) => {
    //         if (error) {
    //             console.error('Upload to Cloudinary failed:', error);
    //         } else {
    //             console.log('Upload to Cloudinary successful:', result);
    //         }
    //     }
    // ).end(buffer);

    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: "Art Space <testartspace2@gmail.com>",
            to: "mohamedabdelstar30@gmail.com",
            subject: "",
            attachments: buffer ? [{'filename': 'attachment.xlsx', 'content': buffer}] : null,
        }

        await transporter.sendMail(mailOptions);
    } catch (e) {
        return Promise.reject(new ApiError(`something happen when send email`, 400));
    }
}

module.exports = {
    sendDocToEmail,
}