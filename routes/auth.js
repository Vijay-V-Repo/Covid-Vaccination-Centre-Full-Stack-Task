const express = require('express');
const router = express.Router();
const User = require('../models/user');

// User signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: 'Username already exists' });
    }
    const user = new User({ username, password });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.json({ message: 'Invalid username or password' });
    }
    res.json({ message: 'Logged In : success' });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
