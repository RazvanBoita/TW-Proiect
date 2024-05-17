const Loader = require("../loaders/Loader");
const UserService = require('../../backend/services/userService');
const { log } = require("console");
const EmailSender = require('../utils/sendMail')
const generateToken = require('../utils/generateToken')
const {parse} = require('url')
const jwt = require('jsonwebtoken')

const hashPassword = require('../utils/hashPassword')

class SignUpService{

    static async signUp(req, res){
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { username, email, password } = JSON.parse(body);
                console.log(`Trying to add user with username ${username}, email: ${email}, password: ${password} `);
            
                const result = await UserService.getUser(email);
                if (!result) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Error at sql query' }));
                }

                if (result.length === 0)
                {
                    //send email, add user
                    const token = generateToken(email)
                    const verificationLink = `http://localhost:5000/signup/verify?token=${token}`;
                    await EmailSender.sendVerificationEmail(email, verificationLink)
                    

                    const newPassword = hashPassword(password)
                    UserService.addUser(email, username, newPassword)
                    console.log(`Added user with email: ${email} and password: ${newPassword}`);

                    res.writeHead(302, { 'Location': '/verifyEmail' });
                    res.end(); 
                } else{
                    console.log("User already exists...");
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'User already exists' }));
                }

                

            } catch (error) {
                log(error);
                res.statusCode = 500; // Internal Server Error
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        });
    }

    static async verifyEmail(req, res) {
        const query = parse(req.url, true).query;
        const token = query.token;
    
        let code = 200;
        let message = "Email verified!";
        let label = "Login";
        let destination = '/login';
    
        if (!token) {
            code = 400;
            message = 'Token is required';
            label = 'Back to signup';
            destination = '/signup';
            return { code, message, label, destination };
        }
    
        try {
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(decoded);
                    }
                });
            });
    
            UserService.verifyUser(decoded.email)
            return { code, message, label, destination };
    
        } catch (err) {
            code = 401;
            message = 'Invalid or expired token';
            label = 'Back to signup';
            destination = '/signup';
            return { code, message, label, destination };
        }
    }

   
}

module.exports = SignUpService;
