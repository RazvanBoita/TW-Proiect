// backend/routes/indexHandler.js
const fs = require('fs');
const path = require('path');

class IndexHandler {
    static getHTML(req, res) {
        const indexPath = path.join(__dirname, '../../frontend/views/index.html');
        const cssPath = path.join(__dirname, '../../frontend/css/menu.css');
        const varsCssPath = path.join(__dirname, '../../frontend/css/vars.css');

        fs.readFile(indexPath, 'utf8', (err, htmlData) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Internal Server Error');
                return;
            }

            fs.readFile(cssPath, 'utf8', (err, cssData) => {
                if (err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('Internal Server Error');
                    return;
                }

                fs.readFile(varsCssPath, 'utf8', (err, varsCssData) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('Internal Server Error');
                        return;
                    }

                    // Combine HTML and CSS content
                    let combinedHTML = htmlData.replace('</head>', `<style>${varsCssData}${cssData}</style></head>`);

                    // Serve images by replacing their paths in HTML content
                    const imagesDirPath = path.join(__dirname, '../../frontend/img');
                    fs.readdir(imagesDirPath, (err, files) => {
                        if (err) {
                            console.error('Error reading images directory:', err);
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'text/plain');
                            res.end('Internal Server Error');
                            return;
                        }

                        files.forEach(file => {
                            const imagePath = path.join(imagesDirPath, file);
                            combinedHTML = combinedHTML.replace(`src="${file}"`, `src="${imagePath}"`);
                        });

                        // Send the combined HTML content as the response
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'text/html');
                        res.end(combinedHTML);
                    });
                });
            });
        });
    }
}

module.exports = IndexHandler;
