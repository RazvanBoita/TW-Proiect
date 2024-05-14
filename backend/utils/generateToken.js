// generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = () =>{
    const user = { name: 'Razvan'};
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log(token);
}   

module.exports = generateToken;