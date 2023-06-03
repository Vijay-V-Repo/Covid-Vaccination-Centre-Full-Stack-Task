const express = require('express');
const router = express.Router();
const User = require('../models/user');
const VaccinationCentre = require('../models/vaccinationCentre');

router.get('/login', (req, res) => {
  res.render('admin');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await User.findOne({ username, isAdmin: true });
    if (admin.password !== password || !admin) {
      return res.render('admin');
    }
    res.redirect('/admin/edit');
  } catch (error) {
    console.error(error);
  }
});

router.get('/edit', async (req, res) => {
  try {
    const centres = await VaccinationCentre.find();
    res.render('edit', { centres });
  } catch (error) {
    console.error(error);
  }
});

router.post('/addCentre', async (req, res) => {
  const { name, workingHours, capacity } = req.body;
  try {
    const centre = await VaccinationCentre.create({ name, workingHours, capacity, availableSlots: capacity });
    res.redirect('/admin/edit');
  } catch (error) {
    console.error(error);
  }
});

router.post('/deleteCentre/:centreId', async (req, res) => {
  const centreId = req.params.centreId;
  try {
    await VaccinationCentre.findByIdAndDelete(centreId);
    res.redirect('/admin/edit');
  } catch (error) {
    console.error(error);
  }
});

router.get('/logout', (req, res) => {
  res.render('index');
});

module.exports = router;
