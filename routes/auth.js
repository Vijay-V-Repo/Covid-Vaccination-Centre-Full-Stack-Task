const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await User.findOne({ username, isAdmin: true });
    if (!admin || admin.password !== password) {
      return res.render('centres', { error: 'Invalid username or password' });
    }
    res.redirect('/centres');
  } catch (error) {
    console.error('Admin login error:', error);
    res.render('centres', { error: 'An error occurred, please try again later' });
  }
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return  res.redirect('/auth/login');
    }
    const user = new User({ username, password });
    await user.save();
    res.redirect('/centres');
  } catch (error) {
    console.error(error);
  }
});

router.get('/logout', (req, res) => {
  res.render('logout');
});

module.exports = router;
