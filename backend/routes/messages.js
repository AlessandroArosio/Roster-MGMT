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
  });
  res.status(200).json({message: "Message deleted!"});
});

// GET one single message from the DB -- probably I won't need this route
router.get('/:id', checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchedMessages;
  const messageQuery = Message.find().where({ receiver: req.params.id});
  if (pageSize && currentPage) {
    messageQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  messageQuery
    .then(documents => {
      fetchedMessages = documents;
      return Message.where({ receiver: req.params.id}).count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Messages for the selected user fetched successfully',
        messages: fetchedMessages,
        maxMessages: count
      });
    });
});

// this one send the messages TO Angular -- this should send only the messages for the person logged in
router.get('', checkAuth,(req, res, next) => {
  Message.find()
    .then(documents => {
      res.status(200).json({
        message: "Message fetch successfully",
        messages: documents
      });
    });
});

module.exports = router;
