const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/staffLogin(.html)?', (req, res) => {
    console.log(`${req.method}`);
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Staff Side', 'staffLogin.html'));
});

router.get('/staffPage(.html)?', (req, res) => {
    console.log(`${JSON.stringify(req.body)}`);
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Staff Side', 'staffPage.html'));
});

router.get('/admin(.html)', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Staff Side', 'admin.html'));    
});

module.exports = router;