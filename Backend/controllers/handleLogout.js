const db = require('../model/database.js');

const userLogout = async (req, res) => {
    const { username, role } = req.body;

    try {
        if (role === 'student') {
            await db.query(`
                UPDATE students
                SET refresh_token = ?
                WHERE student_id = ?   
            `, ['', username]);

            res.clearCookie('jwtStudent', { httpOnly: true, maxAge: 24*60*60*1000 });
        } else if (role === 'staff') {
            await db.query(`
                UPDATE staffs
                SET refresh_token = ?
                WHERE staff_id = ?    
            `, ['', username]);

            res.clearCookie('jwtStaff', { httpOnly: true, maxAge: 24*60*60*1000 });
        }

        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = { userLogout }