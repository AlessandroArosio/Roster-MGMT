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
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
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
// EDIT a shift
app.put('/api/shifts/:id', (req, res, next) => {
  const shift = new Shift({
    _id: req.body.id,
    name: req.body.name
  });
  Shift.updateOne({_id: req.params.id}, shift).then(result => {
    console.log(result);
    res.status(200).json({message: "Shift update successful"});
  });
});

// GET one single shift from the DB
app.get('/api/shifts/:id', (req, res, next) => {
  Shift.findById(req.params.id).then(shift => {
    if (shift) {
      res.status(200).json(shift);
    } else {
      res.status(400).json({message: 'Shift not found'});
    }
  });
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

// EDIT an user
app.put('/api/users/:id', (req, res, next) => {
  const user = new User({
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    telephone: req.body.telephone
  });
  User.updateOne({_id: req.params.id}, user).then(result => {
    console.log("is this happening?");
    res.status(200).json({message: "User update successful"});
  });
});

// GET one single user from the DB
app.get('/api/users/:id', (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({message: 'User not found'});
    }
  });
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

// EDIT a branch
app.put('/api/branches/:id', (req, res, next) => {
  const branch = new Branch({
    _id: req.body.id,
    branchName: req.body.branchName
  });
  Branch.updateOne({_id: req.params.id}, branch).then(result => {
    console.log(result);
    res.status(200).json({message: "Branch update successful"});
  });
});

// GET one single shift from the DB
app.get('/api/branches/:id', (req, res, next) => {
  Branch.findById(req.params.id).then(branch => {
    if (branch) {
      res.status(200).json(branch);
    } else {
      res.status(400).json({message: 'Branch not found'});
    }
  });
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
