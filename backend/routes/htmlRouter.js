const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');
const checkCredentialsExist = require('../utils/middleWare/checkUser');
const checkSession = require('../utils/middleWare/checkSession');
<<<<<<< HEAD
const SignUpService = require('../services/signUpService');
const QuestionService = require('../services/questionService');
=======
const logoutUser = require('../utils/middleWare/logoutUser');
const SignUpService = require('../services/signUpService');
>>>>>>> d4b1c6e (Added logout logic)
function routeHtml(){

    addRoute('GET', '/signup', (req, res) => {
        Loader.loadHTML(req, res, 'signUp.html')
    })

    addRoute('GET', '/verifyEmail', (req, res) => {
        const data = {
            title: 'Verify Email',
            message: `Email verification sent!`,
            buttonLabel: 'All done?',
            destination: '/login'
        };
        Loader.loadTemplateEngineHTML(req, res, 'intermediary.hbs', data);
    })

    addRoute('POST', '/signup', (req, res) => {
        //process signup ig
        SignUpService.signUp(req, res)
    })

    addRoute('GET', '/signup/verify', (req, res) => {
        SignUpService.verifyEmail(req, res)
    })

    addRoute('GET', '/signup/verify', async (req, res) => {

        const result = await SignUpService.verifyEmail(req, res)
        
        const code = result.code
        const message = result.message
        const label = result.label
        const destination = result.destination

        const data = {
            title: 'Email verification',
            message: message,
            buttonLabel: label,
            destination: destination
        }
        Loader.loadTemplateEngineHTML(req, res, 'intermediary.hbs', data)
    })

    addRoute('GET', '/quiz', async (req, res) => {
        const data = await QuestionService.serveQuestion()
        //insert as data
        Loader.loadTemplateEngineHTML(req, res, 'quiz.hbs', data)
    }) //pe viitor sa am si checksession aici

    addRoute('GET', '/login', (req, res) => {
        Loader.loadHTML(req, res, 'logIn.html')
    });

    addRoute('POST', '/login', (req, res) => {
        Loader.redirect(req, res, 'index.html', '/')
    }, checkCredentialsExist);

    addRoute('GET', '/navbar.html', (req, res)=>{
        Loader.loadHTML(req, res, 'navbar.html')
    })

    addRoute('GET', '/', (req, res) => {
        Loader.loadHTML(req, res, 'index.html')
    }, checkSession); 

    addRoute('POST', '/logout', (req, res) =>{
        Loader.loadHTML(req, res, 'logIn.html')
    }, logoutUser)
}

module.exports = routeHtml