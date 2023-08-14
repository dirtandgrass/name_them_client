
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';

const OAuth2 = google.auth.OAuth2;


const sendMail = async (email: string, subject: string, text: string) => {

  console.log("ERROR: ", email, subject, text);
  try {
    const mailOptions: Mail.Options = {
      from: process.env.USER_EMAIL,
      to: email,
      subject,
      text
    }

    let emailTransporter = await createTransporter();
    if (typeof emailTransporter !== "string") {
      await emailTransporter.sendMail(mailOptions);
      return true;
    }
    console.log(emailTransporter);
    return false;
  } catch (err) {
    console.log("ERROR: ", err)
    return false;
  }

};

export default sendMail;

const createTransporter = async (): Promise<nodemailer.Transporter<SMTPTransport.SentMessageInfo> | string> => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log("*ERR: ", err)
          reject();
        }
        resolve(token);
      });
    });


    //const t:SMTPTransport.AuthenticationType =




    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        accessToken: accessToken as string,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    return transporter;
  } catch (err) {
    return err as string;
  }
};