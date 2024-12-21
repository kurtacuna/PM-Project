// Overview:
// Adds a document option into the database

const db = require('../model/database.js');

const addDocumentOption = async (req, res) => {
    console.log(req.body);
    const documentId = req.body['document-id'];
    const documentType = req.body['document-type'];
    const fee = req.body.fee;

    console.log(documentId+documentType+fee);

    try {
        await db.query(`
            INSERT INTO documents
            VALUES (?, ?, ?)    
        `, [documentId, documentType, fee]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = { addDocumentOption }