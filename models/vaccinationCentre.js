const mongoose = require('mongoose');

const vaccinationCentreSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  workingHours: { 
    type: String, 
    required: true 
  },
  capacity: { 
    type: Number, 
    required: true 
  },
});

vaccinationCentreSchema.virtual('availableSlots').get(function () {
  return this.capacity > 0;
});

module.exports = mongoose.model('VaccinationCentre', vaccinationCentreSchema);
