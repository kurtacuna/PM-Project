// Overview:
// Handle all api calls to registrar

const db = require('../model/database.js');

// Retrieve registrar gcash number from the database and it to a client
const getRegistrarNumber = async (req, res) => {
    try {
        const [registrarGcashNumber] = await db.query(`
            SELECT gcash_number FROM registrar
        `);
        res.status(200).json(registrarGcashNumber);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

// Update the registrar gcash number in the database
const putRegistrarNumber = async (req, res) => {
    const newRegistrarGcashNumber = req.body['gcash-number'];

    try {
        await db.query(`
            UPDATE registrar
            SET gcash_number = ?    
        `, [newRegistrarGcashNumber]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = { getRegistrarNumber, putRegistrarNumber }