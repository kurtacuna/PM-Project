const db = require('../model/database.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const refreshAccessToken = async (req, res) => {
    const { username, role } = req.body;

    let refreshToken;
    if (role === 'student') {
        refreshToken = req.cookies.jwtStudent;
    } else if (role === 'staff') {
        refreshToken = req.cookies.jwtStaff;
    }

    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        try {
            let foundUser;
            if (role === 'student') {
                [foundUser] = await db.query(`
                    SELECT * FROM students
                    WHERE refresh_token = ? AND student_id = ?
                `, [refreshToken, username]);
            } else if (role === 'staff') {
                [foundUser] = await db.query(`
                    SELECT * FROM staffs
                    WHERE refresh_token = ? AND staff_id = ?
                `, [refreshToken, username]);
            }
            
            console.log(username);
            console.log(role);
            console.log(foundUser);
            
            if (foundUser.length === 0) {
                res.sendStatus(403);
            } else {
                console.log('access token refreshed');
                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET,
                    (err) => {
                        if (err) {
                            res.sendStatus(403);
                        } else {
                            const accessToken = jwt.sign(
                                {},
                                process.env.ACCESS_TOKEN_SECRET,
                                { expiresIn: '1s' }
                            );

                            res.status(201).json({ 'accessToken':  accessToken });
                        }
                    }  
                );
            }

        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = { refreshAccessToken }