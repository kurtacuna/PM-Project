const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/handleLogout.js');

router.post('/', logoutController.userLogout);

module.exports = router;