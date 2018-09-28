const express = require('express');
const MessageController = require('../controllers/messages');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// this one receives a message FROM angular to store in database
router.post('', checkAuth, MessageController.createMessage);

// deleting a MESSAGE document from MongoDB
router.delete('/:id', checkAuth, MessageController.deleteMessage);

// GET one single message from the DB
router.get('/:id', checkAuth, MessageController.getSingleMessage);

// this one send the messages TO Angular -- this should send only the messages for the person logged in
router.get('', checkAuth, MessageController.getMessages);

module.exports = router;
