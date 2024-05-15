const fs = require('fs');
const path = require('path')
const cssPath = path.join(__dirname, '../../frontend/css/');
const viewsPath = path.join(__dirname, '../../frontend/views/');
const imagePath = path.join(__dirname, '../../frontend/img/')

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

    static async loadHTML(concatPath){
        const filePath = viewsPath.concat(concatPath)
        return fs.readFile(filePath, 'utf-8');
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
}

module.exports = Loader