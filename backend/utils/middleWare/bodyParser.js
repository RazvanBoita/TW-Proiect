const bodyParser = (req, res, next) => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            req.body = JSON.parse(body);
        } catch (error) {
            req.body = {};
        }
        next();
    });
};

module.exports = bodyParser;
