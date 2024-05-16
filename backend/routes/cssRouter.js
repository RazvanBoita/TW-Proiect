const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');


function routeCss(){
    addRoute('GET', '/css/menu.css', (req, res) => {
        Loader.loadCSS(req, res, 'menu.css')
    }); 
    
    addRoute('GET', '/css/vars.css', (req, res) => {
        Loader.loadCSS(req, res, 'vars.css')
    })
  
    addRoute('GET', '/css/logIn.css', (req, res)=>{
        Loader.loadCSS(req, res, 'logIn.css')
    })
    addRoute('GET', '/css/forbidden.css', (req, res)=>{
        Loader.loadCSS(req, res, 'forbidden.css')
    })
    
}

module.exports = routeCss