const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');
const checkCredentialsExist = require('../utils/middleWare/checkUser');
const checkSession = require('../utils/middleWare/checkSession');
const signUp = require('../services/signUpService');


function routeHtml(){

    addRoute('GET', '/', (req, res) => {
        Loader.loadHTML(req, res, 'index.html')
    }, checkSession); 

    addRoute('GET', '/signup', (req, res) => {
        Loader.loadHTML(req, res, 'signUp.html')
    })

    addRoute('GET', '/verifyEmail', (req, res) => {
        const data = {
            title: 'Verify Email',
            message: `Proceed verifying your email!`,
            buttonLabel: 'All done?',
            destination: '/login'
        };
        Loader.loadTemplateEngineHTML(req, res, 'intermediary.hbs', data);
    })

    addRoute('POST', '/signup', (req, res) => {
        //process signup ig
        const resCode = signUp(req, res)
        if(resCode==200){
            res.writeHead(302, { 'Location': '/verifyEmail' });
            res.end();        
        }
    })
    
    addRoute('GET', '/login', (req, res) => {
        Loader.loadHTML(req, res, 'logIn.html')
    });

    addRoute('POST', '/login', (req, res) => {
        Loader.redirect(req, res, 'index.html', '/')
    }, checkCredentialsExist);

}

module.exports = routeHtml