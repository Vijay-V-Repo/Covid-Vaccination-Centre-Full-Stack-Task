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

// To Search vaccination centres
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const centres = await VaccinationCentre.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { workingHours: { $regex: searchTerm, $options: 'i' } },
      ],
    });
    res.render('search', { centres });
  } catch (error) {
    console.error(error);
  }
});

// To Book a vaccination slot
router.post('/:centreId/book', async (req, res) => {
  try {
    const centreId = req.params.centreId;
    const centre = await VaccinationCentre.findById(centreId);

    if (!centre) {
      return res.send('Vaccination Centre Not found :(');
    }

    if (centre.capacity <= 0) {
      return res.send('Currently No Slots Available.');
    }

    // Check if the user is already booked for the same day
    const today = new Date().toISOString().split('T')[0];
    const existingBooking = await Booking.findOne({
      centre: centreId,
      user: req.user._id,
      date: today,
    });

    if (existingBooking) {
      return res.send('You have already booked a slot.');
    }

    // To Create a new booking
    const booking = new Booking({
      centre: centreId,
      user: req.user._id,
      date: today,
    });

    centre.capacity--;
    await centre.save();
    await booking.save();

    res.send('Vaccination Slot has been booked successfully');
  } catch (error) {
    console.error(error);
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
