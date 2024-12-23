// Overview:
// Authenticates a login

const db = require('../model/database.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
            const accessToken = jwt.sign(
                {},
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1s' }
            );

            const refreshToken = jwt.sign(
                {},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            
            if (role === 'student') {
                res.cookie('jwtStudent', refreshToken, { httpOnly: true, maxAge: 24*60*60*1000 });

                await db.query(`
                    UPDATE students
                    SET refresh_token = ?
                    WHERE student_id = ?    
                `, [refreshToken, foundUser[0].student_id]);
                res.status(201).json({ 'username': foundUser[0].student_id, 'role': role, 'accessToken': accessToken });

            } else if (role === 'staff') {
                res.cookie('jwtStaff', refreshToken, { httpOnly: true, maxAge: 24*60*60*1000 });

                await db.query(`
                    UPDATE staffs
                    SET refresh_token = ?
                    WHERE staff_id = ?    
                `, [refreshToken, foundUser[0].staff_id]);
                res.status(201).json({ 'username': foundUser[0].staff_id, 'role': role, 'accessToken': accessToken });
            }
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { verifyUser }