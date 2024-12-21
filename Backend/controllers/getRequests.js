// Overview:
// Takes all requests from the database and sends it to a client

const db = require('../model/database.js');

const retrieveRequests = async (req, res) => {
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

module.exports = { retrieveRequests }