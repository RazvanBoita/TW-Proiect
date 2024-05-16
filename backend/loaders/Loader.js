const fs = require('fs');
const path = require('path')
const cssPath = path.join(__dirname, '../../frontend/css/');
const viewsPath = path.join(__dirname, '../../frontend/views/');
const imagePath = path.join(__dirname, '../../frontend/img/')
const jsPath = path.join(__dirname, '../../frontend/js/');

class Loader{
    static loadCSS(req, res, concatPath) {
        const filePath = path.join(cssPath, concatPath);
        fs.readFile(filePath, (err, data) => {
            if(err){
                console.error(err);
                res.writeHead(500)                
                res.end()
                return
            }
            res.writeHead(200, {'Content-type': 'text/css'})
            res.end(data)
        });
    }

    static loadHTML(req, res, concatPath, statusCode = 200){
        const filePath = viewsPath.concat(concatPath)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end();
            } else {
                res.writeHead(statusCode, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    static redirect(req, res, concatPath, redirectUrl)
    {
        const filePath = viewsPath.concat(concatPath)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end();
            } else {
                res.writeHead(302, { 'Location': `${redirectUrl}` });
                res.end(data);
            }
        });
    }

    static loadImage(req, res, concatPath) {
        const filePath = imagePath.concat(concatPath)
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
    static loadJs(req, res, concatPath)
    {
        const filePath = jsPath.concat(concatPath)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/js' });
                res.end(data);
            }
        });
    }
}

module.exports = Loader