const mongoose = require('mongoose');

// const rotaSchema = mongoose.Schema({
//   branchName: {type: String, required: true},
//   employeeName: {type: String, required: true},
//   monShift: {type: String, required: true},
//   tueShift: {type: String, required: true},
//   wedShift: {type: String, required: true},
//   thuShift: {type: String, required: true},
//   friShift: {type: String, required: true},
//   satShift: {type: String, required: true},
//   sunShift: {type: String, required: true},
//   rotaStartDate: {type: String, required: true},
//   rotaEndDate: {type: String, required: true},
//   testArray: [{type: String}]
// });

const rotaSchema = mongoose.Schema({
  branchName: {type: String, required: true},
  employeeName: [{type: String, required: true}],
  shifts: [{type: String, required: true}],
  rotaStartDate: {type: String, required: true},
  rotaEndDate: {type: String, required: true},
});

module.exports = mongoose.model('Rota', rotaSchema);
