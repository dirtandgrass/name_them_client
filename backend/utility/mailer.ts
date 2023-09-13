
import nodemailer from 'nodemailer';

import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';


const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.SMTP_PASS,
  },
})


const sendMail = async (email: string, subject: string, text: string) => {

  await transporter.sendMail({
    from: process.env.USER_EMAIL, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
  });
};

export default sendMail;
