// Overview:
// Removes a document option in the database

const db = require('../model/database.js');

const removeDocument = async (req, res) => {
    const { documentId } = req.body;

    try {
        db.query(`
            DELETE FROM documents
            WHERE document_id = ?
        `, [documentId]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = { removeDocument }