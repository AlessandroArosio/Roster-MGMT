const express = require('express');
const Message = require('../models/message');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// this one receives a message FROM angular to store in database
router.post('', checkAuth, (req, res, next) => {
  const message = new Message({
    sender: req.body.sender,
    receiver: req.body.receiver,
    message: req.body.message
  });
  console.log(message);
  message.save().then(createMessage => {
    res.status(201).json({
      message: 'Message stored successfully',
      messageId: createMessage._id
    });
  });
});

// deleting a MESSAGE document from MongoDB
router.delete('/:id', checkAuth, (req, res, next) => {
  Message.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Message deleted!"});
});

// GET one single message from the DB -- probably I won't need this route
router.get('/:id', checkAuth, (req, res, next) => {
  Shift.findById(req.params.id).then(shift => {
    if (shift) {
      res.status(200).json(shift);
    } else {
      res.status(400).json({message: 'Shift not found'});
    }
  });
});

// this one send the messages TO Angular -- this should send only the messages for the person logged in
router.get('', checkAuth,(req, res, next) => {
  Message.find()
    .then(documents => {
      res.status(200).json({
        message: "Message fetch successfully",
        shifts: documents
      });
    });
});

module.exports = router;
