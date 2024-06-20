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

    addRoute('GET', '/css/intermediary.css', (req, res) => {
        Loader.loadCSS(req, res, 'intermediary.css')
    })

    addRoute('GET', '/frontend/css/quiz.css', (req, res) => {
        Loader.loadCSS(req, res, 'quiz.css')
    })

    addRoute('GET', '/css/quiz.css', (req, res) => {
        Loader.loadCSS(req, res, 'quiz.css')
    })

    addRoute('GET', '/frontend/css/menu.css', (req, res) => {
        Loader.loadCSS(req, res, 'menu.css')
    })

    addRoute('GET', '/frontend/css/vars.css', (req, res) => {
        Loader.loadCSS(req, res, 'vars.css')})

    addRoute('GET', '/css/navbar.css', (req, res) => {
        Loader.loadCSS(req, res, 'navbar.css')
    })

    addRoute('GET', '/css/createQuery.css', (req, res)=>{
        Loader.loadCSS(req, res, 'createQuery.css')
    })

    addRoute('GET', '/css/quizFinish.css', (req, res)=>{
        Loader.loadCSS(req, res, 'quizFinish.css')
    })
        
    addRoute('GET', '/css/quizzes.css', (req, res)=>{
        Loader.loadCSS(req, res, 'quizzes.css');
    })

    addRoute('GET', '/css/progress.css', (req, res)=>{
        Loader.loadCSS(req, res, 'progress.css');
    })

    addRoute('GET', '/css/leaderboards.css', (req, res)=>{
        Loader.loadCSS(req, res, 'leaderboards.css');
    })
    
    addRoute('GET', '/css/goingHome.css', (req, res) => {
        Loader.loadCSS(req, res, 'goingHome.css')
    })

    addRoute('GET', '/css/verifyProblems.css', (req, res) => {
        Loader.loadCSS(req, res, 'verifyProblems.css')
    })
}

module.exports = routeCss