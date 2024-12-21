// Overview:
// Updates the fee of a document option in the database

const db = require('../model/database.js');

const editDocumentFee = async (req, res) => {
    const documentId = req.body['document-id'];
    const fee = req.body.fee;

    try {
        await db.query(`
            UPDATE documents
            SET fee = ?
            WHERE document_id = ?
        `, [fee, documentId]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = { editDocumentFee }