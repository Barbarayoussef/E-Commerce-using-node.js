import nodemailer from "nodemailer";
import env from "../../../config/env.service.js";

export const sendEmail = async (email, subject, text, html) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: env.emailUser,
      pass: env.emailPass,
    },
  });

  let info = await transporter.sendMail({
    from: `"${env.emailName}" <${env.emailUser}>`,
    to: email,
    subject: subject,
    text: text,
    html,
  });
};
