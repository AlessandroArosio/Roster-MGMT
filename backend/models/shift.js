const mongoose = require('mongoose');

const shiftSchema = mongoose.Schema({
  name: {type: String, required: true},
  start: {type: String, required: true},
  end: {type: String, required: true}
});

module.exports = mongoose.model('Shift', shiftSchema);
