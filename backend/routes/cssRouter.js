const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');


function routeCss(){
    addRoute('GET', '/menu.css', (req, res) => {
        Loader.loadCSS(req, res, 'menu.css')
    }); 
    
    addRoute('GET', '/vars.css', (req, res) => {
        Loader.loadCSS(req, res, 'vars.css')
    })
}

module.exports = routeCss