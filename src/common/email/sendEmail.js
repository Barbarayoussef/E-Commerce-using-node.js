import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text, html) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "barbarayoussef12@gmail.com",
      pass: "lxbc tuym wybx slhm",
    },
  });

  let info = await transporter.sendMail({
    from: '"Barbara Youssef" <barbarayoussef12@gmail.com>',
    to: email,
    subject: subject,
    text: text,
  });
};
