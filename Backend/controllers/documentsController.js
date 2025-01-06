// Overview:
// Handles all api calls to documents

const db = require('../model/database.js');

// Takes all document options from the database and sends it to a client
const getDocumentOptions =  async (req, res) => {
    try {
        const [options] = await db.query('SELECT * FROM documents');
        res.status(200).json(options);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

// Adds a document option to the database
const postDocumentOption = async (req, res) => {
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

// Updates the fee of a document option in the database
const putDocumentOption = async (req, res) => {
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

// Removes a document option in the database
const deleteDocumentOption = async (req, res) => {
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

module.exports = { getDocumentOptions, postDocumentOption, putDocumentOption, deleteDocumentOption }