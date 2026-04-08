const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email, token) => {
  const url = `https://digital-library-frontend-258f.onrender.com/verify-email?token=${token}`;
  await resend.emails.send({
    from: 'Digital Library <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your Digital Library email',
    html: `<p>Click <a href="${url}">here</a> to verify your email. Link expires in 24 hours.</p>`,
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const url = `https://digital-library-frontend-258f.onrender.com/reset-password?token=${token}`;
  await resend.emails.send({
    from: 'Digital Library <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your Digital Library password',
    html: `<p>Click <a href="${url}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };