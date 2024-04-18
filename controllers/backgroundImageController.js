const fs = require('fs');
function handleBackgroundImageRequest(req, res) {
    const imgPath = './img/';
    const filePath = imgPath + 'first.png';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        }
    });
}

module.exports ={
    handleBackgroundImageRequest,
}