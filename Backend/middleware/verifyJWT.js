const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.sendStatus(401);
    } else {
        console.log('received request');
        const accessToken = authHeader.split(' ')[1];
        console.log(accessToken);
        jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET,
            (err) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    next();
                }
            }
        );
    }
}

module.exports = { verifyJWT }