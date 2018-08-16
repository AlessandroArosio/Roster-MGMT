const mongoose = require('mongoose');

const rotaSchema = mongoose.Schema({
  branchName: {type: String, required: true},
  userFirstName: {type: String, required: true},
  userLastName: {type: String, required: true},
  shiftName: {type: String, required: true},
  shiftStart: {type: String, required: true},
  shiftEnd: {type: String, required: true},
  rotaStartDate: {type: String, required: true},
  rotaEndDate: {type: String, required: true}
});

module.exports = mongoose.model('Rota', rotaSchema);
