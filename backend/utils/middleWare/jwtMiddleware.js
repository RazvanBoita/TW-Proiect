const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const jwtSecret = process.env.JWT_SECRET;


const jwtMiddleware = (req, res, next) => {
    //parsarea tokenului din header(care arata asa: Bearer {TOKEN})
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Unauthorized, token missing');
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            console.log(err);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Forbidden: ' + err);
        }
        //totul e ok, trecem mai departe
        req.user = user;
        next();
    });
};

module.exports = jwtMiddleware;
