import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';
import { verifyEmailTemplate } from "./verify-email-template.js";
import { htmlChangePass } from "./chang-password.template.js";


export const sendEmail = async (email, type) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.USER_GMAIL,
      pass: process.env.PASSWORD_GMAIL,
    },
  });

  const token = jwt.sign({ email }, process.env.JWT_SECRET_LOGIN)
  let test = verifyEmailTemplate(token)
  if (type == 'forgetPassword') test = htmlChangePass(token)
  const info = await transporter.sendMail({
    from: `"E-commerce App" <${process.env.USER_GMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "can you verify email now", // Subject line
    html: test, // html body

  });
  console.log("Message sent: %s", info.messageId);

}
