const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');


function routeJs(){
    addRoute('GET', '/js/login.js', (req, res) => {
        Loader.loadJs(req, res, 'login.js')
    }); 
    
    addRoute('GET', '/js/ButtonHandler.js', (req, res) => {
        Loader.loadJs(req, res, 'ButtonHandler.js')
    })

    addRoute('GET', '/js/navbar.js', (req, res) => {
        Loader.loadJs(req, res, 'navbar.js')
    })
    
}

module.exports = routeJs