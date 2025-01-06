// Overview:
// Handles all api calls to request

const db = require('../model/database.js');

// Takes all requests from the database and sends it to a client
const getRequests = async (req, res) => {
    try {
        const username = req.query.username;
        const role = req.query.role;
    
        console.log(username);
        let requestsWithDetails;
        if (role === 'student') {
            [requestsWithDetails] = await db.query(`
                SELECT * FROM request_with_details 
                WHERE student_id = ?
                ORDER BY date_requested DESC
            `, [username]);
        } else if (role === 'staff') {
            [requestsWithDetails] = await db.query(`
                SELECT * FROM request_with_details ORDER BY date_requested DESC
            `);
        }
    
        res.status(200).json(requestsWithDetails);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

// Inserts a request into the database
const postRequest = async (req, res) => {
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

// Updates the relevant details of a request in the database
const dayjs = require('dayjs');
const { sendEmail } = require('../middleware/sendEmail.js');

const putRequest = async (req, res) => {
    console.log('update request received');
    try {
        const { requestId, remarks, status, staffId, studentEmail } = req.body;
        const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    
        await db.query(`
            UPDATE requests
            SET status = ?, remarks = ?, staff_id = ?
            WHERE request_id = ?    
        `, [status, remarks, staffId, requestId]);
    
        if (status === 'To Receive') {
            await db.query(`
                UPDATE requests
                SET date_completed = ?
                WHERE request_id = ?    
            `, [dateTime, requestId]);
        } else if (status === 'Released') {
            await db.query(`
                UPDATE requests
                SET date_released = ?
                WHERE request_id = ?    
            `, [dateTime, requestId]);
        } else if (status === 'Rejected') {
            await db.query(`
                UPDATE requests
                SET date_rejected = ?
                WHERE request_id = ?    
            `, [dateTime, requestId]);
        }

        // console.log(requestId, remarks, status, adminId, studentEmail);
        // sendEmail(requestId, remarks, status, adminId, studentEmail);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { getRequests, postRequest, putRequest }