const express = require('express');
const router = express.Router();
const VaccinationCentre = require('../models/vaccinationCentre');

// To Get all vaccination centres
router.get('/', async (req, res) => {
  try {
    const centres = await VaccinationCentre.find();
    res.render('centres', { centres });
  } catch (error) {
    console.error(error);
  }
});

// To Search for vaccination centres
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


// To Handle search form submission
router.post('/search', (req, res) => {
  const searchTerm = req.body.q;
  res.redirect(`/centres/search?q=${searchTerm}`);
});


// Book a vaccination slot
router.post('/:centreId/book', async (req, res) => {
  try {
    const centreId = req.params.centreId;
    const centre = await VaccinationCentre.findById(centreId);
    if (!centre) {
      return res.send('Vaccination Centre Not Found :(');
    }

    if (centre.availableSlots === 0) {
      return res.send('Currently No available Slots.');
    }

    centre.availableSlots -= 1;
    centre.capacity -= 1;
    await centre.save();

    res.render('bookingResult', { bookingSuccessful: true, remainingCapacity: centre.capacity });
  } catch (error) {
    console.error('Booking error:', error);
    res.render('bookingResult', { bookingSuccessful: false });
  }
});

// To Add a new vaccination centre
router.post('/', async (req, res) => {
  try {
    const { name, workingHours, capacity } = req.body;
    const centre = new VaccinationCentre({ name, workingHours, capacity });
    await centre.save();
    res.json({ message: 'Vaccination centre created successfully' });
  } catch (error) {
    console.error(error);
  }
});

// To Get dosage details (group by centres)
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

// To Remove a vaccination centre
router.delete('/:centreId', async (req, res) => {
  try {
    const { centreId } = req.params;
    await VaccinationCentre.findByIdAndRemove(centreId);
    res.json({ message: 'Vaccination centre removed successfully' });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
