const express = require('express');
const Rota = require('../models/rota');
const Shift = require('../models/shift');
const router = express.Router();

// this one receives a branch FROM Angular
router.post('', (req, res, next) => {
  const rota = new Rota({
    branchName: req.body.branchName,
    userFirstName: req.body.userFirstName,
    userLastName: req.body.userLastName,
    shift: req.body.shift,
    rotaStartDate: req.body.rotaStartDate,
    rotaEndDate: req.body.rotaEndDate
  });
  rota.save().then(createdRota => {
    console.log(createdRota);
    res.status(201).json({
      message: "Rota added successfully",
      branchId: createdRota._id
    });
  });
});




module.exports = router;
