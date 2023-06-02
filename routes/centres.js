const express = require('express');
const router = express.Router();
const VaccinationCentre = require('../models/vaccinationCentre');

// Get all vaccination centres
router.get('/', async (req, res) => {
  try {
    const centres = await VaccinationCentre.find();
    res.json(centres);
  } catch (error) {
    console.error(error);
  }
});

// Add a new vaccination centre
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

// Get dosage details (group by centres)
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

// Remove a vaccination centre
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
