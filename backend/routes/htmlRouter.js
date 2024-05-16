const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');
const checkCredentialsExist = require('../utils/middleWare/checkUser');
const checkSession = require('../utils/middleWare/checkSession');

function routeHtml(){
    addRoute('GET', '/', (req, res) => {
        Loader.loadHTML(req, res, 'index.html')
    }, checkSession); 
    
    addRoute('GET', '/login', (req, res) => {
        Loader.loadHTML(req, res, 'logIn.html')
    });
    addRoute('POST', '/login', (req, res) => {
        Loader.redirect(req, res, 'index.html', '/')
    }, checkCredentialsExist);

}

module.exports = routeHtml