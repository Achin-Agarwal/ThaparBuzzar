const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (recipient, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Your Name" <${process.env.EMAIL}>`,
      to: recipient,
      subject: subject,
      text: message,
      html: `<p>${message}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};

module.exports = sendEmail;
