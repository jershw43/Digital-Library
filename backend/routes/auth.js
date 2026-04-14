const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email');
 
// Register
router.post('/register', async (req, res) => {
  console.log('Register hit', req.body);
  const { username, email, password } = req.body;
  const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(password))
    return res.status(400).json({ message: 'Password must be 8+ chars with one uppercase letter' });
 
  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });
 
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
 
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = new User({
      username, email, password: hashed,
      emailVerifyToken: crypto.createHash('sha256').update(verifyToken).digest('hex'),
      emailVerifyExpires: Date.now() + 24 * 60 * 60 * 1000,
    });
    console.log('Saving user...');
    await user.save();
    console.log('User saved, sending email...');
    await sendVerificationEmail(email, verifyToken);
    console.log('Email sent!');
 
    res.status(201).json({ message: 'Registered! Check your email to verify your account.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message });
  }
});
 
// Verify email
router.get('/verify-email', async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.query.token).digest('hex');
  try {
    const user = await User.findOne({
      emailVerifyToken: hashed,
      emailVerifyExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
 
    user.emailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save();
 
    res.json({ message: 'Email verified! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.emailVerified) return res.status(403).json({ message: 'Please verify your email first' });
 
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });
 
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
    await sendPasswordResetEmail(req.body.email, resetToken);
    await user.save();
 
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// Reset password
router.post('/reset-password', async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.body.token).digest('hex');
  try {
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
 
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(req.body.password))
      return res.status(400).json({ message: 'Password must be 8+ chars with one uppercase letter' });
 
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
 
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
module.exports = router;