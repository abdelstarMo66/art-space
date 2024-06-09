const path = require("path");

const nodemailer = require("nodemailer");
const ejs = require('ejs');

const sendEmail = async (options, variables) => {
    const templatePath = path.join(__dirname, 'assets', `email.ejs`);
    const html = await ejs.renderFile(templatePath, variables);

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
        to: options.email,
        subject: options.subject,
        html: html,
        attachments: options.data ? [{'filename': 'attachment.pdf', 'content': options.data}] : null,
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;