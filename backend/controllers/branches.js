const Branch = require('../models/branch');

exports.createBranch = (req, res, next) => {
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
}

exports.deleteBranch = (req, res, next) => {
  Branch.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
  });
  res.status(200).json({message: "Branch deleted!"});
}

exports.editBranch =  (req, res, next) => {
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
}

exports.getSingleBranch = (req, res, next) => {
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
}

exports.getBranches = (req, res, next) => {
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
}
