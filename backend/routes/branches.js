const express = require('express');
const Branch = require('../models/branch');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');


// this one receives a branch FROM Angular
router.post('', checkAuth, checkUser, (req, res, next) => {
  const branch = new Branch({
    branchName: req.body.branchName,
  });
  branch.save().then(createdBranch => {
    res.status(201).json({
      message: "Branch added successfully",
      branchId: createdBranch._id
    });
  })
    .catch(error => {
      res.status(500).json({
        message: 'Create branch failed. Error occurred'
      });
    });
});

// deleting a BRANCH document from MongoDB
router.delete('/:id', checkAuth, checkUser, (req, res, next) => {
  Branch.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Branch deleted!"});
});

// EDIT a branch
router.put('/:id', checkAuth, checkUser, (req, res, next) => {
  const branch = new Branch({
    _id: req.body.id,
    branchName: req.body.branchName
  });
  Branch.updateOne({_id: req.params.id}, branch).then(result => {
    console.log(result);
    res.status(200).json({message: "Branch update successful"});
  })
    .catch(error => {
      res.status(500).json({
        message: 'Couldn\'t update branch. Error occurred'
      });
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
  })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching branch failed. Error occurred'
      });
    });
});

// this one send the branches TO Angular
router.get('', checkAuth, (req, res, next) => {
  Branch.find()
    .then(documents => {
      res.status(200).json({
        message: "Branch fetch successfully",
        branches: documents
      });
    })
    .catch(error => {
    res.status(500).json({
      message: 'Fetching branches failed. Error occurred'
    });
  });
});

module.exports = router;
