// Overview:
// Updates the relevant details of a request in the database

const dayjs = require('dayjs');
const db = require('../model/database.js');
const { sendEmail } = require('../middleware/sendEmail.js');

const updateRequestRemarksAndStatus = async (req, res) => {

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

module.exports = { updateRequestRemarksAndStatus }