const url = require('url');
const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');
//middlewares
const checkCredentialsExist = require('../utils/middleWare/checkUser');
const checkSession = require('../utils/middleWare/checkSession');
const logoutUser = require('../utils/middleWare/logoutUser');
const checkAdminPrivileges = require('../utils/middleWare/checkAdminPrivilages');
const handleCreateQuizz = require('../utils/middleWare/handleCreateQuizz');


const SignUpService = require('../services/signUpService');
const SqlService = require('../services/sqlService')
const AdminPrivilages = require('../utils/adminPrivilages');
const CategoryService = require('../services/categoryService');
const QuestionService = require('../services/questionService');
const QuizService = require('../services/quizService');
const { getUserData } = require('../utils/cookieHandler');
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
        const data = await QuestionService.serveQuestion();
        //insert as data
        Loader.loadTemplateEngineHTML(req, res, 'quiz.hbs', data)
    }) 

    //pe viitor sa am si checksession aici

    addRoute('GET', '/login', (req, res) => {
        Loader.loadHTML(req, res, 'logIn.html')
    });

    addRoute('POST', '/login', (req, res) => {
        Loader.redirect(req, res, 'index.html', '/')
    }, checkCredentialsExist);

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


    addRoute('GET', '/quiz', async(req, res) => {
        Loader.loadHTML(req, res, 'quizz.html')
    })

    addRoute('GET', '/load-quiz', async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const quizzId = parsedUrl.query.id;
        let data = null;
        if(!quizzId)
            //this will always be the first question, so it should be an easy one
            data = await QuestionService.chooseFirstQuestion()
        else
        {
            quizzData = await QuestionService.getQuestionByID(quizzId);
            if(quizzData === null)
            {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(quizzData));
                return;
            }
            data = {
                currentQuestion : 1,
                questionContent: quizzData.title,
                tableDescription: quizzData.description,
                questionId: quizzId,
                start_date: new Date()
            }
        }
        res.setHeader('Content-Type', 'application/json');

        // Send the JSON response
        res.end(JSON.stringify(data));

    }) 
    


    addRoute('GET', '/navbar.html', async (req, res)=>{
        const result = AdminPrivilages.getCreateQuizzButton(req);
        const data = {
            result
        }
        Loader.loadTemplateEngineHTML(req, res, 'navbar.hbs', data);
    })

    addRoute('GET', '/', (req, res) => {
        Loader.loadHTML(req, res, 'index.html')
    }, checkSession); 

    addRoute('POST', '/logout', (req, res) =>{
        Loader.loadHTML(req, res, 'logIn.html')
    }, logoutUser)

    addRoute('GET', '/createQuiz', async (req, res) =>{
        const categories = await CategoryService.getCategoriesAsHTML();
        const data = {
            categories
        };
        Loader.loadTemplateEngineHTML(req, res, 'createSqlQuery.hbs', data);
    }, checkAdminPrivileges)

    addRoute('POST', '/createQuiz', async (req, res)=>{
        const categories = await CategoryService.getCategoriesAsHTML();
        const data = {
            categories
        };
        Loader.loadTemplateEngineHTML(req, res, 'createSqlQuery.hbs', data);
    }, handleCreateQuizz)

    addRoute('GET', '/importQuizz', (req, res) =>{
        Loader.loadHTML(req, res, 'importQuizz.html')
    }, logoutUser)

    addRoute('GET', '/quizzes', async (req, res)=>{
        Loader.loadHTML(req, res, 'quizzes.html');
    }, checkSession)
    addRoute('GET', '/progress', async (req, res)=>{
        Loader.loadHTML(req, res, 'progress.html');
    }, checkSession)

    addRoute('GET', '/forbidden', (req, res) =>{
        Loader.loadHTML(req, res, 'forbidden.html');
    })

    addRoute('POST', '/run-sql', (req, res) => {
        SqlService.processQuery(req, res)
    })

    addRoute('POST', '/next-question', (req, res) => {
        QuestionService.handleNextQuestion(req, res)
    })
    
    addRoute('POST', '/finish-quiz', async (req, res) => {
        await QuizService.finishQuiz(req, res)
    })

    addRoute('GET', '/finish-quiz', (req, res) => {
        Loader.loadHTML(req, res, 'quizFinish.html')
    })

    addRoute('POST', '/load-quiz-result', async (req, res) => {
        await QuizService.getQuizResults(req, res)
    })
}

module.exports = routeHtml