const express = require('express');
const Rota = require('../models/rota');
const router = express.Router();

// this one receives a rota FROM Angular
router.post('', (req, res, next) => {
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
router.delete('/:id', (req, res, next) => {
  Rota.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Rota deleted!"});
});

// EDIT a rota
router.put('/:id', (req, res, next) => {
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
router.get('/:id', (req, res, next) => {
  Rota.findById(req.params.id).then(rota => {
    if (rota) {
      res.status(200).json(rota);
      console.log(rota);
    } else {
      res.status(400).json({message: 'Rota not found'});
      console.log('rota not found');
    }
  });
});

// this one send the shifts TO Angular
router.use('', (req, res, next) => {
  Rota.find()
    .then(documents => {
      res.status(200).json({
        message: "Rota fetch successfully",
        rotas: documents
      });
    });
});




module.exports = router;
