const express = require('express');
const router = express.Router();
const authenticateLogin = require('../controllers/authenticateLogin.js');

router.post('/', authenticateLogin.verifyUser)

module.exports = router;