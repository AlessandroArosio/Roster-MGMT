const express = require('express');
const BranchController = require('../controllers/branches');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');


// this one receives a branch FROM Angular
router.post('', checkAuth, checkUser, BranchController.createBranch);

// deleting a BRANCH document from MongoDB
router.delete('/:id', checkAuth, checkUser, BranchController.deleteBranch);

// EDIT a branch
router.put('/:id', checkAuth, checkUser, BranchController.editBranch);

// GET one single branch from the DB
router.get('/:id', checkAuth, BranchController.getSingleBranch);

// this one send the branches TO Angular
router.get('', checkAuth, BranchController.getBranches);

module.exports = router;
