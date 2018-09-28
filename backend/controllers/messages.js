const Message = require('../models/message');

exports.createMessage = (req, res, next) => {
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
  })
    .catch(error => {
      res.status(500).json({
        message: 'Create message failed. Error occurred'
      });
    });
}

exports.deleteMessage = (req, res, next) => {
  Message.deleteOne({_id: req.params.id}).then(result => {
  });
  res.status(200).json({message: "Message deleted!"});
}

exports.getSingleMessage = (req, res, next) => {
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
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching message failed. Error occurred'
      });
    });
}

exports.getMessages = (req, res, next) => {
  Message.find()
    .then(documents => {
      res.status(200).json({
        message: "Message fetch successfully",
        messages: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching messages failed. Error occurred'
      });
    });
}
