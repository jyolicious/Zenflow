const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/User');
const { hasMX } = require('../utils/emailHelpers');
const { sendVerificationEmail } = require('../utils/mailer');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

function generateVerificationToken(userId) {
  // short-lived token for email verification
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // basic checks
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    if (!validator.isEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be >= 6 characters' });

    // optional: enforce company/university domains only (comment out if not desired)
    // const allowedDomains = ['yourcollege.edu','yourcompany.com'];
    // const domain = email.split('@')[1].toLowerCase();
    // if (!allowedDomains.includes(domain)) return res.status(403).json({ error: 'Email domain not allowed' });

    // MX check (ensure domain can receive email and not a known disposable domain)
    const mxOk = await hasMX(email);
    if (!mxOk) return res.status(400).json({ error: 'Email domain cannot receive mail or is disposable' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password_hash: hash, is_verified: false });

    // create a verification token (short expiry)
    const vtoken = generateVerificationToken(user._id.toString());

    // send verification email (do not block creation if mail fails — but log it)
    try {
      await sendVerificationEmail(email, vtoken, name);
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr);
      // decide: you can either delete user or keep user and require admin to re-send.
      // For now, we'll keep user and return a warning.
      return res.status(201).json({ warning: 'User created but failed to send verification email. Contact admin.' });
    }

    return res.status(201).json({ message: 'User created. Please check your email to verify your account.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/verify-email?token=...
router.get('/verify-email', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).send('Missing token');

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).send('Invalid or expired token');
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).send('User not found');

    if (user.is_verified) return res.send('Email already verified');

    user.is_verified = true;
    await user.save();

    // Optionally redirect to frontend success page
    const redirectUrl = `${process.env.FRONTEND_URL.replace(/\/$/, '')}/verify-success`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
   const user = await User.findOne({ email });
if (!user) return res.status(400).json({ error: 'Invalid credentials' });
if (!user.is_verified) return res.status(403).json({ error: 'Please verify your email before logging in' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.is_verified) return res.status(400).json({ error: 'Already verified' });

    const vtoken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    await sendVerificationEmail(email, vtoken, user.name);
    return res.json({ message: 'Verification email resent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
