const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const { log } = require('console');


const templateData = {
    cssPath: path.join(__dirname, '../../frontend/css/menu.css'), // Path to your CSS file
};



const templatePath = path.join(__dirname, '../../templates/index.hbs');
const templateSource = fs.readFileSync(templatePath, 'utf8')

const template = handlebars.compile(templateSource) 

const renderedHTML = template(templateData)

console.log(renderedHTML);
