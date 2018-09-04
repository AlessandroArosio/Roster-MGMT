const express = require('express');
const Rota = require('../models/rota');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

// this one receives a rota FROM Angular
router.post('', checkAuth, checkUser, (req, res, next) => {
  const rota = new Rota({
    branchName: req.body.branchName.branchName,
    employeeName: req.body.employeeArray,
    shifts: req.body.shifts,
    rotaStartDate: req.body.rotaStartDate,
    rotaEndDate: req.body.rotaEndDate,
  });
  rota.save().then(createdRota => {
    console.log(createdRota);
    console.log("Rota has been stored in DB");
    res.status(201).json({
      message: "Rota added successfully",
      rotaId: createdRota._id
    });
  });
});

// deleting a ROTA document from MongoDB
router.delete('/:id', checkAuth, checkUser, (req, res, next) => {
  Rota.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Rota deleted!"});
});

// EDIT a rota
router.put('/:id', checkAuth, checkUser, (req, res, next) => {
  const rota = new Rota({
    _id: req.body.id,
    branchName: req.body.branchName.branchName,
    employeeName: req.body.employeeArray,
    shifts: req.body.shifts,
    rotaStartDate: req.body.rotaStartDate,
    rotaEndDate: req.body.rotaEndDate,
  });
  Rota.updateOne({_id: req.params.id}, rota).then(result => {
    console.log(result);
    res.status(200).json({message: "Rota update successful"});
  });
});

// GET one single shift from the DB
router.get('/:id', checkAuth, (req, res, next) => {
  Rota.findById(req.params.id).then(rota => {
    if (rota) {
      res.status(200).json(rota);
    } else {
      res.status(400).json({message: 'Rota not found'});
      console.log('rota not found');
    }
  });
});

// this one send the rotas TO Angular
router.get('', checkAuth, (req, res, next) => {
  const startdate = +req.query.start;
  const enddate = +req.query.end;
  const rotaQuery = Rota.find();
  rotaQuery.then(documents => {
    let filteredRota = {};
    if (startdate && enddate) {
      filteredRota = applyFilter(documents, startdate, enddate);
      res.status(200).json({
        message: "Rota fetch successfully",
        rotas: filteredRota
      });
    } else {
      res.status(200).json({
        message: "Rota fetch successfully",
        rotas: documents
      });
    }
  });
});

function applyFilter(array, start, end) {
  let skimmedArray = [];
  for (let i = 0; i < array.length; i++) {
    const startDateInMs = new Date(array[i].rotaStartDate).getTime();
    const endDateInMs = new Date(array[i].rotaEndDate).getTime();
    if (startDateInMs >= start && endDateInMs <= end) {
      skimmedArray.push(array[i]);
    }
  }
  return skimmedArray;
}


module.exports = router;
