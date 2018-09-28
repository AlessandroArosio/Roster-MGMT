const Shift = require('../models/shift');

exports.createShift = (req, res, next) => {
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
  })
    .catch(error => {
      res.status(500).json({
        message: 'Create shift failed. Error occurred'
      });
    });
}

exports.deleteShift = (req, res, next) => {
  Shift.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Shift deleted!"});
}

exports.editShift = (req, res, next) => {
  const shift = new Shift({
    _id: req.body.id,
    name: req.body.name
  });
  Shift.updateOne({_id: req.params.id}, shift).then(result => {
    console.log(result);
    res.status(200).json({message: "Shift update successful"});
  })
    .catch(error => {
      res.status(500).json({
        message: 'Couldn\'t update shift. Error occurred'
      });
    });
}

exports.getSingleShift = (req, res, next) => {
  Shift.findById(req.params.id).then(shift => {
    if (shift) {
      res.status(200).json(shift);
    } else {
      res.status(400).json({message: 'Shift not found'});
    }
  })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching shift failed. Error occurred'
      });
    });
}

exports.getShifts = (req, res, next) => {
  Shift.find()
    .then(documents => {
      res.status(200).json({
        message: "Shift fetch successfully",
        shifts: documents
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching shifts failed. Error occurred'
      });
    });
}
