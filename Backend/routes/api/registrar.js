const express = require('express');
const router = express.Router();
const registrarController = require('../../controllers/registrarController.js');

router.route('/number')
    .get(registrarController.getRegistrarNumber)
    .put(registrarController.putRegistrarNumber);


module.exports = router;