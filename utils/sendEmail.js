import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587, // currently TSL, use 465 for SSL.
  secure: false, // true if using 465
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_SMTP_KEY,
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