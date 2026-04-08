require('dotenv').config();
const nodemailer = require('nodemailer');
 
const transporter = nodemailer.createTransport({
  host: '74.125.133.108', // Gmail's explicit IPv4 address to avoid IPv6 issues
  port: 587,
  secure: false, // STARTTLS
  family: 4,     // Force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
 
const sendVerificationEmail = async (email, token) => {
  const url = `https://digital-library-frontend-258f.onrender.com/verify-email?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your Digital Library email',
    html: `<p>Click <a href="${url}">here</a> to verify your email. Link expires in 24 hours.</p>`,
  });
};
 
const sendPasswordResetEmail = async (email, token) => {
  const url = `https://digital-library-frontend-258f.onrender.com/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset your Digital Library password',
    html: `<p>Click <a href="${url}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  });
};
 
module.exports = { sendVerificationEmail, sendPasswordResetEmail };