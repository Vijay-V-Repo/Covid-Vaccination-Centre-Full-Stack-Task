const express = require('express');
const router = express.Router();
const User = require('../models/user');
const VaccinationCentre = require('../models/vaccinationCentre');

router.get('/login', (req, res) => {
  res.render('admin');
});

// Admin login form submission route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await User.findOne({ username, isAdmin: true });
    if (!admin || admin.password !== password) {
      return res.render('admin', { error: 'Invalid username or password' });
    }
    res.redirect('/admin/edit');
  } catch (error) {
    console.error('Admin login error:', error);
    res.render('admin', { error: 'An error occurred, please try again later' });
  }
});

// Admin dashboard route
router.get('/edit', async (req, res) => {
  try {
    const centres = await VaccinationCentre.find();
    res.render('edit', { centres });
  } catch (error) {
    console.error('Admin Edit error:', error);
    res.render('edit', { error: 'An error occurred, please try again later' });
  }
});

// Admin add centre route
router.post('/addCentre', async (req, res) => {
  const { name, workingHours, capacity } = req.body;
  try {
    const centre = await VaccinationCentre.create({ name, workingHours, capacity, availableSlots: capacity });
    res.redirect('/admin/edit');
  } catch (error) {
    console.error('Add centre error:', error);
    res.render('edit', { error: 'An error occurred while adding the centre' });
  }
});

// Admin delete centre route
router.post('/deleteCentre/:centreId', async (req, res) => {
  const centreId = req.params.centreId;
  try {
    await VaccinationCentre.findByIdAndDelete(centreId);
    res.redirect('/admin/edit');
  } catch (error) {
    console.error('Delete centre error:', error);
    res.render('edit', { error: 'An error occurred while deleting the centre' });
  }
});

module.exports = router;
