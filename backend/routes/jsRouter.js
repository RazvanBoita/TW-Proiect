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
    addRoute('GET', '/js/getQuizzesPage.js', (req, res) => {
        Loader.loadJs(req, res, 'getQuizzesPage.js')
    })
    addRoute('GET', '/js/templates/quizzList.js', (req, res)=>{
        Loader.loadJs(req, res, '/templates/quizzList.js')
    })
    addRoute('GET', '/js/templates/categoryList.js', (req, res)=>{
        Loader.loadJs(req, res, '/templates/categoryList.js')
    })
    addRoute('GET', '/js/templates/quizzCounter.js', (req, res)=>{
        Loader.loadJs(req, res, '/templates/quizzCounter.js')
    })

    addRoute('GET', '/frontend/js/quiz.js', (req, res) => {
        Loader.loadJs(req, res, 'quiz.js')
    })

    addRoute('GET', '/js/quiz.js', (req, res) => {
        Loader.loadJs(req, res, 'quiz.js')
    })
    addRoute('GET', '/js/quizFinish.js', (req, res) => {
        Loader.loadJs(req, res, 'quizFinish.js')
    })
    addRoute('GET', '/js/redirectToSelectedQuizz.js', (req, res) => {
        Loader.loadJs(req, res, 'redirectToSelectedQuizz.js')
    })

}

module.exports = routeJs