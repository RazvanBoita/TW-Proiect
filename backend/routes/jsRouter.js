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
    addRoute('GET', '/js/logout.js', (req, res) => {
        Loader.loadJs(req, res, 'logout.js')
    })
    addRoute('GET', '/js/importQuestion.js', (req, res)=>{
        Loader.loadJs(req, res, 'importQuestion.js')
    })
    addRoute('GET', '/js/submitCreateQuizzForm.js', (req ,res)=>{
        Loader.loadJs(req, res, 'submitCreateQuizzForm.js')
    })
    
    addRoute('GET', '/js/exportQuestion.js', (req, res) => {
        Loader.loadJs(req, res, 'exportQuestion.js')
    })
    addRoute('GET', '/js/liveView.js', (req, res) => {
        Loader.loadJs(req, res, 'liveView.js')
    })

    addRoute('GET', '/frontend/js/quiz.js', (req, res) => {
        Loader.loadJs(req, res, 'quiz.js')
    })

    addRoute('GET', '/js/quiz.js', (req, res) => {
        Loader.loadJs(req, res, 'quiz.js')
    })

}

module.exports = routeJs