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
      branchId: createdRota._id
    });
  });
});




module.exports = router;
