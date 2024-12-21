// Overview:
// Inserts a request into the database

const db = require('../model/database.js');

const updateDB = async (req, res) => {
    try {
        const { username } = req.body;
        const requestID = username + req.body.timestamp;

        delete req.body.username;
        delete req.body.timestamp;

        const [document] = await db.query(`SELECT * FROM documents WHERE document_id = ?`, [req.body['document-id']]);
        const document_type = document[0].document_type;
        const fee = document[0].fee * req.body['number-of-copies'];
        

        const newRequest = {
            'request-id': requestID,
            'student-id': username,
            'document-id': req.body['document-id'],
            'fee': fee,
            'reference-number': req.body['reference-number']
        }

        const newRequestDetails = {
            'request-id': requestID,
            ...req.body,
            'document-type': document_type
        }

        await db.query(`
            INSERT INTO requests (request_id, student_id, document_id, cost, reference_number)
            VALUES (?, ?, ?, ?, ?)
        `, [newRequest['request-id'], newRequest['student-id'], newRequest['document-id'], newRequest.fee, newRequest['reference-number']]);

        await db.query(`
            INSERT INTO request_details
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)    
        `, [
            newRequestDetails['request-id'], 
            newRequestDetails.lastname, 
            newRequestDetails.firstname, 
            newRequestDetails.middlename, 
            newRequestDetails['email-address'], 
            newRequestDetails['contact-number'], 
            newRequestDetails['purpose-of-request'], 
            newRequestDetails['document-type'], 
            newRequestDetails['number-of-copies'], 
            newRequestDetails['document-details']
        ]);

        console.log('Request received');
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { updateDB };