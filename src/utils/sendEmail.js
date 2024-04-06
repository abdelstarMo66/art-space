const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
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
        text: options.text,
        attachments: options.data ? [{'filename': 'attachment.csv', 'content': options.data}] : null,
    }

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;