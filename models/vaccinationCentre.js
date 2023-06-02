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

module.exports = mongoose.model('VaccinationCentre', vaccinationCentreSchema);
