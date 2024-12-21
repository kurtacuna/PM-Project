const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/studentLogin(.html)?', (req, res) => {
    console.log(`${req.method}`);
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Student Side', 'studentLogin.html'));
});

router.get('/studentPage(.html)?', (req, res) => {
    console.log(`${JSON.stringify(req.body)}`);
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Student Side', 'studentPage.html'));
});

module.exports = router;