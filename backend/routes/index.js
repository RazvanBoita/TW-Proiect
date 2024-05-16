const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const templatePath = path.join(__dirname, '../../templates/index.hbs');

class IndexHandler {
    static get(req, res) {
        try {
            const templateSource = fs.readFileSync(templatePath, 'utf8');
            const template = handlebars.compile(templateSource);

            const templateData = {
                cssPath: '/menu.css',
                titlu: 'SALUT'
            };

            const renderedHtml = template(templateData);

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderedHtml);
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Server error');
        }
    }
}

module.exports = IndexHandler;
