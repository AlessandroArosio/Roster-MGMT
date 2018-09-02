const express = require('express');
const Shift = require('../models/shift');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

// this one receives a shift FROM Angular
router.post('', checkAuth, (req, res, next) => {
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

// deleting a SHIFT document from MongoDB
router.delete('/:id', checkAuth, (req, res, next) => {
  Shift.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Shift deleted!"});
});

// EDIT a shift
router.put('/:id', checkAuth, (req, res, next) => {
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
router.get('/:id', checkAuth, (req, res, next) => {
  Shift.findById(req.params.id).then(shift => {
    if (shift) {
      res.status(200).json(shift);
    } else {
      res.status(400).json({message: 'Shift not found'});
    }
  });
});

// this one send the shifts TO Angular
router.get('', checkAuth,(req, res, next) => {
  Shift.find()
    .then(documents => {
      res.status(200).json({
        message: "Shift fetch successfully",
        shifts: documents
      });
    });
});


module.exports = router;
