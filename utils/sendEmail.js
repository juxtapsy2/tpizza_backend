import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // TLS
  secure: false, // true for SSL (465)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (options) => {
  try {
    await transporter.sendMail(options);
    console.log("Mail sent to:", options.to);
  } catch(err) {
    console.log(err);
    throw new Error("Error sending mail:", err);
  }
};

export default sendEmail;