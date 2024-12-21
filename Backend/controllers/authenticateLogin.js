// Overview:
// Authenticates a login

const db = require('../model/database.js');

const verifyUser = async (req, res) => {
    console.log(`${req.method} \t ${JSON.stringify(req.body)}`);

    try {
        const { username, password, role } = req.body;
        let foundUser;
        if (role === 'student') {
            [foundUser] = await db.query(`
                SELECT * FROM students
                WHERE student_id = ?    
            `, [username]);
        } else if (role === 'staff') {
            [foundUser] = await db.query(`
                SELECT * FROM staffs
                WHERE staff_id = ?    
            `, [username]);
        }

        console.log(foundUser);

        if (foundUser.length === 0 || foundUser[0].password !== password) {
            return res.sendStatus(401);
        } else {
            if (role === 'student') {
                res.status(201).json({ 'username': foundUser[0].student_id, 'role': role });
            } else if (role === 'staff') {
                res.status(201).json({ 'username': foundUser[0].staff_id, 'role': role });
            }
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { verifyUser }