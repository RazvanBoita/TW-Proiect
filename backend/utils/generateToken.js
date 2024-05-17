const jwt = require('jsonwebtoken');

const generateToken = (email) => {
    const payload = {
        email: email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return token;
}

module.exports = generateToken;