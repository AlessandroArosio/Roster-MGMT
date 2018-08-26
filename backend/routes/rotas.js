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
  // Rota.deleteOne({_id: req.params.id}).then(result => {
  //   console.log(result);
  // });
  console.log('Rota has been deleted');
  res.status(200).json({message: "Rota deleted!"});
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
