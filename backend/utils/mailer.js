// utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(toEmail, token, name = "") {
  const verifyUrl = `${process.env.FRONTEND_URL.replace(
    /\/$/,
    ""
  )}/verify-email?token=${token}`;

  const html = `
    <p>Hi ${name || "there"},</p>
    <p>Thank you for signing up for ZenFlow. Please verify your email address by clicking the link below:</p>
    <p><a href="${verifyUrl}">Verify your email</a></p>
    <p>If the link doesn't work, copy-paste this URL into your browser: ${verifyUrl}</p>
    <p>If you did not sign up, please ignore this email.</p>
    <p>— ZenFlow Team</p>
  `;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: toEmail,
    subject: "Verify your ZenFlow email",
    html,
  };

  return transporter.sendMail(mailOptions);
}

export { transporter };
