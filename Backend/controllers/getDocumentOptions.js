// Overview:
// Takes all document options from the database and sends it to a client

const db = require('../model/database.js');

const documentOptions =  async (req, res) => {
    try {
        const [options] = await db.query('SELECT * FROM documents');
        res.status(200).json(options);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { documentOptions }