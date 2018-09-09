const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');
const router = express.Router();

// this one receives a user FROM Angular
router.post('', checkAuth, checkUser, (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        telephone: req.body.telephone,
        password: hash
      });
      user.save().then(createdUser => {
        res.status(201).json({
          message: "User added successfully",
          userId: createdUser._id
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
    });
});

// deleting a USER document from MongoDB
router.delete('/:id', checkAuth, checkUser, (req, res, next) => {
  User.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "User deleted!"});
});

// EDIT an user
router.put('/:id', checkAuth, checkUser, (req, res, next) => {
  const user = new User({
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    telephone: req.body.telephone
  });
  User.updateOne({_id: req.params.id}, user).then(result => {
    res.status(200).json({message: "User update successful"});
  });
});

// GET one single user from the DB
router.get('/:id', checkAuth, (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({message: 'User not found'});
    }
  });
});

// this one send the users TO Angular
router.get('', checkAuth, (req, res, next) => {
  User.find()
    .then(documents => {
      res.status(200).json({
        message: "User fetch successfully",
        users: documents
      });
    });
});


module.exports = router;
