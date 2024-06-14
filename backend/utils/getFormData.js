const { parse } = require('querystring');

async function getData(req) {
    let body = '';

    // Using await to handle asynchronous event listeners
    await new Promise((resolve, reject) => {
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            resolve();
        });

        req.on('error', (error) => {
            reject(error);
        });
    });
    // Using try/catch to handle potential JSON parsing errors
    try {
        return JSON.parse(body);
    } catch (error) {
        throw new Error('Invalid format');
    }
}

module.exports = {getData};