const express = require('express');
const RotaController = require('../controllers/rotas');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');

// this one receives a rota FROM Angular
router.post('', checkAuth, checkUser, RotaController.createRota);

// deleting a ROTA document from MongoDB
router.delete('/:id', checkAuth, checkUser, RotaController.deleteRota);

// EDIT a rota
router.put('/:id', checkAuth, checkUser, RotaController.editRota);

// GET one single rota from the DB
router.get('/:id', checkAuth, RotaController.getSingleRota);

// this one send the rotas TO Angular
router.get('', checkAuth, RotaController.getRotas);

module.exports = router;
