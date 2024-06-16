const cookieHandler = require('../utils/cookieHandler');
const UserService = require('../services/userService');
const UserData = require('../models/userData');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken')
const EmailSender = require('../utils/sendMail')
const {parse} = require('url')


class LoginService {
    static async login(req, res) {
        let body = '';

        // Collect data from the request's readable stream
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { email, password } = JSON.parse(body);
                // Check if the user exists in the database based on the provided email
                const result = await UserService.getUser(email);

                if (!result) {
                    // If user does not exist, respond with error code 2
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ resCode: 2 }));
                }

                // If the result length is 0, it means the query did not find the user
                if (result.length === 0) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ resCode: 2 }));
                }

                // Verify the password
                const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
                if (hashedPassword !== result[0].password) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ resCode: 3 }));
                }

                // User exists and credentials are correct
                const userData = new UserData(result[0].id, result[0].name, result[0].email, result[0].isAdmin);
                cookieHandler.setSessionId(res, userData);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ resCode: 1 }));
                
            } catch (error) {
                // If an error occurs while checking the credentials, respond with an error message
                console.error('Error checking user credentials:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Forbidden: ' + error);
            }
        });
    }

    static async recoverPassword(req, res) {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });
    
        req.on('end', async () => {
            const { email } = JSON.parse(body);
    
            try {
                const result = await UserService.getUser(email);
    
                if (!result) {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Error at sql query' }));
                }
    
                let resCode = 0; // 0 for err, 1 for ok, 2 for user doesn't exist
    
                if (result.length === 0) {
                    resCode = 2;
                } else {
                    const token = generateToken(email);
                    const verificationLink = `${process.env.BASE_URL}/recover/verify?token=${token}`;
                    await EmailSender.sendChangePassEmail(email, verificationLink);
                    resCode = 1;
                }
    
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ resCode }));
    
            } catch (error) {
                console.error('Error recovering password:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ resCode: resCode }));
            }
        });
    }

    static async updatePassword(req, res, email){
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async()=>{
            const {password} = JSON.parse(body)
            const result = await UserService.updatePassword(email, password)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ result }));
        })
    }
}

module.exports = LoginService;
