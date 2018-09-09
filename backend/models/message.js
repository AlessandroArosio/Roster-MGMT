const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: {type: String, required: true},
  receiver: {type: String, required: true},
  message: {type: String, required: true}
});

module.exports = mongoose.model('Message', messageSchema);
