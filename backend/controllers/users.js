const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.createUser = (req, res, next) => {
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
            message: 'Email address already present in database'
          });
        });
    });
}

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "User deleted!"});
}

exports.editUser = (req, res, next) => {
  const user = new User({
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    telephone: req.body.telephone
  });
  User.updateOne({_id: req.params.id}, user).then(result => {
    res.status(200).json({message: "User update successful"});
  })
    .catch(error => {
      res.status(500).json({
        message: 'Couldn\'t update user. Error occurred'
      });
    });
}

exports.getSingleUser = (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({message: 'User not found'});
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching user failed. Error occurred'
      });
    });
}

exports.getUsers = (req, res, next) => {
  User.find()
    .then(documents => {
      res.status(200).json({
        message: "User fetch successfully",
        users: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching users failed. Error occurred'
      });
    });
}
