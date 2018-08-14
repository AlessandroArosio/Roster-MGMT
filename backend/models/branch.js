const mongoose = require('mongoose');

const branchSchema = mongoose.Schema({
  branchName: {type: String, required: true}
});

module.exports = mongoose.model('Branch', branchSchema);
