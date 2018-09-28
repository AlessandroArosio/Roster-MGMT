const express = require('express');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');
const UserController = require('../controllers/users');

const router = express.Router();

// this one receives a user FROM Angular
router.post('', checkAuth, checkUser, UserController.createUser);

// deleting a USER document from MongoDB
router.delete('/:id', checkAuth, checkUser, UserController.deleteUser);

// EDIT an user
router.put('/:id', checkAuth, checkUser, UserController.editUser);

// GET one single user from the DB
router.get('/:id', checkAuth, UserController.getSingleUser);

// this one send the users TO Angular
router.get('', checkAuth, UserController.getUsers);


module.exports = router;
