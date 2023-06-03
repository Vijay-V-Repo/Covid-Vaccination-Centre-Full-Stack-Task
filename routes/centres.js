const express = require('express');
const router = express.Router();
const VaccinationCentre = require('../models/vaccinationCentre');

router.get('/', async (req, res) => {
  try {
    const centres = await VaccinationCentre.find();
    res.render('centres', { centres });
  } catch (error) {
    console.error(error);
  }
});

router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const centres = await VaccinationCentre.find({
      $or: [
        { name: { $regex: new RegExp(searchTerm, 'i') } },
        { workingHours: { $regex: new RegExp(searchTerm, 'i') } },
      ],
    });
    res.render('search', { centres });
  } catch (error) {
    console.error(error);
  }
});

router.post('/search', (req, res) => {
  const searchTerm = req.body.q;
  res.redirect(`/centres/search?q=${searchTerm}`);
});

router.post('/:centreId/book', async (req, res) => {
  try {
    const centreId = req.params.centreId;
    const centre = await VaccinationCentre.findById(centreId);
    if (!centre) {
      return res.send('Sorry, Vaccination Centre Not Found :(');
    }
    if (centre.availableSlots === 0) {
      return res.send('Currently No available Slots.');
    }
    centre.availableSlots -= 1;
    centre.capacity -= 1;
    await centre.save();
    res.render('bookingResult', { bookingSuccessful: true, remainingCapacity: centre.capacity, name : centre.name, id : centre.centreId, time : centre.workingHours });
  } catch (error) {
    console.error(error);
  }
});

router.get('/dosage', async (req, res) => {
  try {
    const dosageDetails = await VaccinationCentre.aggregate([
      {
        $group: {
          _id: '$name',
          totalDosage: { $sum: '$capacity' },
        },
      },
    ]);
    res.json(dosageDetails);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
