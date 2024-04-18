const fs = require('fs');
function handleMenuRequest(req, res) {
    const cssPath = './css/';
    const filePath = cssPath + 'menu.css';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        }
    });
}

module.exports = {
    handleMenuRequest
}