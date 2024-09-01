const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let otps = {};

app.post('/send-otp', (req, res) => {
  const { email, otpLength } = req.body;
  const otp = generateOTP(otpLength || 6);
  
  otps[email] = otp;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'esmatrealmuslim@gmail.com',
      pass: 'xsed ycej enls oqgc',
    },
  });
  const mailOptions = {
    from: 'esmatrealmuslim@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    } else {
      return res.status(200).json({ message: 'OTP sent successfully' });
    }
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  
  if (otps[email] === otp) {
    return res.status(200).json({ message: 'OTP verified successfully' });
  } else {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
});

function generateOTP(length) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
