const express = require('express');
const Branch = require('../models/branch');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');


// this one receives a branch FROM Angular
router.post('', checkAuth, (req, res, next) => {
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

// deleting a BRANCH document from MongoDB
router.delete('/:id', checkAuth, (req, res, next) => {
  Branch.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Branch deleted!"});
});

// EDIT a branch
router.put('/:id', checkAuth, (req, res, next) => {
  const branch = new Branch({
    _id: req.body.id,
    branchName: req.body.branchName
  });
  Branch.updateOne({_id: req.params.id}, branch).then(result => {
    console.log(result);
    res.status(200).json({message: "Branch update successful"});
  });
});

// GET one single branch from the DB
router.get('/:id', checkAuth, (req, res, next) => {
  Branch.findById(req.params.id).then(branch => {
    if (branch) {
      res.status(200).json(branch);
    } else {
      res.status(400).json({message: 'Branch not found'});
    }
  });
});

// this one send the branches TO Angular
router.use('', checkAuth, (req, res, next) => {
  Branch.find()
    .then(documents => {
      res.status(200).json({
        message: "Branch fetch successfully",
        branches: documents
      });
    });
});

module.exports = router;
