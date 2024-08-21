// pages/api/sendOtp.js
import nodemailer from 'nodemailer';

// Utility function to generate random OTP
function getRandomString(length, chars) {
  let result = '';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    // Generate OTP
    const otp = getRandomString(6, '0123456789');

    // Setup email transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Send OTP email
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
