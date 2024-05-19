import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const G_REFRESH_TOKEN = process.env.G_REFRESH_TOKEN;
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: G_REFRESH_TOKEN });

async function sendResetPasswordEmail({ email, token }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'jonathanrioja38@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: G_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    const mailOptions = {
      from: 'FITMASTER <jonathanrioja38@gmail.com>',
      to: email,
      subject: 'Reset your password',
      text: 'Click the link below to reset your password',
      html: `<a href="http://localhost:3000/reset-password/${token}">Reset Password</a>`
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error('Failed to send reset password email:', err);
    throw new Error("Failed to send email");
  }
}

export { sendResetPasswordEmail };
