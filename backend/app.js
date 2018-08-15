const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Shift = require('./models/shift');
const User = require('./models/user');
const Branch = require('./models/branch');

const app = express();

mongoose.connect("mongodb+srv://alessandro:z6GjeGj4O2f2FRs7@cluster0-yr8nv.mongodb.net/roster-mgmt")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

// this one receives a shift FROM Angular
app.post('/api/shifts', (req, res, next) => {
  const shift = new Shift({
    name: req.body.name,
    start: req.body.start,
    end: req.body.end
  });
  shift.save().then(createdShift => {
    res.status(201).json({
      message: "Shift added successfully",
      shiftId: createdShift._id
    });
  });
});

// this one receives a user FROM Angular
app.post('/api/users', (req, res, next) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    telephone: req.body.telephone
  });
  user.save().then(createdUser => {
    res.status(201).json({
      message: "User added successfully",
      userId: createdUser._id
    });
  });
});

// this one receives a branch FROM Angular
app.post('/api/branches', (req, res, next) => {
  const branch = new Branch({
    branchName: req.body.branchName,
  });
  branch.save().then(createdBranch => {
    res.status(201).json({
      message: "Branch added successfully",
      branchId: createdBranch._id
    });
  });
});

// deleting a SHIFT document from MongoDB
app.delete('/api/shifts/:id', (req, res, next) => {
  Shift.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Shift deleted!"});
});

// this one send the shifts TO Angular
app.use('/api/shifts', (req, res, next) => {
  Shift.find()
    .then(documents => {
      res.status(200).json({
        message: "Shift fetch successfully",
        shifts: documents
      });
    });
});

// deleting a USER document from MongoDB
app.delete('/api/users/:id', (req, res, next) => {
  User.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "User deleted!"});
});

// this one send the users TO Angular
app.use('/api/users', (req, res, next) => {
  User.find()
    .then(documents => {
      res.status(200).json({
        message: "User fetch successfully",
        users: documents
      });
    });
});

// deleting a BRANCH document from MongoDB
app.delete('/api/branches/:id', (req, res, next) => {
  Branch.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Branch deleted!"});
});

// this one send the branches TO Angular
app.use('/api/branches', (req, res, next) => {
  Branch.find()
    .then(documents => {
      res.status(200).json({
        message: "Branch fetch successfully",
        branches: documents
      });
    });
});


module.exports = app;
