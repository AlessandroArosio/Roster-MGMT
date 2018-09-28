const express = require('express');
const ShiftController = require('../controllers/shifts');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

const router = express.Router();

// this one receives a shift FROM Angular
router.post('', checkAuth, checkUser, ShiftController.createShift);

// deleting a SHIFT document from MongoDB
router.delete('/:id', checkAuth, checkUser, ShiftController.deleteShift);

// EDIT a shift
router.put('/:id', checkAuth, checkUser, ShiftController.editShift);

// GET one single shift from the DB
router.get('/:id', checkAuth, ShiftController.getSingleShift);

// this one send the shifts TO Angular
router.get('', checkAuth, ShiftController.getShifts);


module.exports = router;
