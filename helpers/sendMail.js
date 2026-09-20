const nodemailer = require("nodemailer");

module.exports.sendMail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOption = {
        from: `"Task Management" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subject,
        html: html
    }

    transporter.sendMail(mailOption, function (error, info) {
        if (error) {
            console.log("error: ", error)
        } else {
            console.log("Email sent: ", info.response)
        }
    })
}
