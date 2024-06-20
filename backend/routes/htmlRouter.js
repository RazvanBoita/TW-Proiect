const url = require('url');
const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');
//middlewares
const {parse} = require('url')
const checkCredentialsExist = require('../utils/middleWare/checkUser');
const checkSession = require('../utils/middleWare/checkSession');
const logoutUser = require('../utils/middleWare/logoutUser');
const checkAdminPrivileges = require('../utils/middleWare/checkAdminPrivileges');
const handleCreateQuizz = require('../utils/middleWare/handleCreateQuizz');
const jwt = require('jsonwebtoken')


const SignUpService = require('../services/signUpService');
const SqlService = require('../services/sqlService')
const AdminPrivilages = require('../utils/adminPrivilages');
const CategoryService = require('../services/categoryService');
const QuestionService = require('../services/questionService');
const LoginService = require('../services/LoginService')
const QuizService = require('../services/quizService');
const CommentService = require('../services/commentService')

const { getUserData,  checkSessionId, setQuizCompleted, unsetQuizCompleted} = require('../utils/cookieHandler');
const UserService = require('../services/userService');
const checkCreateQuizPrivileges = require('../utils/middleWare/checkCreateQuizPrivileges');
const PendingService = require('../services/pendingService');


let currEmail;
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

    
    // addRoute('GET', '/quiz', async (req, res) => {
    //     const data = await QuestionService.serveQuestion();
    //     //insert as data
    //     Loader.loadTemplateEngineHTML(req, res, 'quiz.hbs', data)
    // }) 

    //pe viitor sa am si checksession aici

    addRoute('GET', '/login', (req, res) => {
        Loader.loadHTML(req, res, 'logIn.html')
    });

    addRoute('POST', '/login', (req, res) => {
        LoginService.login(req, res)
    });

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
    }, checkSession)



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

    addRoute('GET', '/navbar.html', (req, res)=>{
        if(!checkSessionId(req))
            Loader.loadHTML(req, res, 'navbar.html', 404);
        else
            Loader.loadHTML(req, res, 'navbar.html');
    })

    addRoute('GET', '/', (req, res) => {
        Loader.loadHTML(req, res, 'index.html')
    }); 

    addRoute('POST', '/logout', (req, res) =>{
        Loader.loadHTML(req, res, 'logIn.html')
    }, logoutUser)

    addRoute('GET', '/createQuiz', async (req, res) =>{
        Loader.loadHTML(req, res, 'createSqlQuery.html');
    }, checkCreateQuizPrivileges)

    addRoute('POST', '/createQuiz', async (req, res)=>{
        unsetQuizCompleted(req) 
        Loader.loadHTML(req, res, 'createSqlQuery.html');
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
    addRoute('GET', '/leaderboards', async (req, res)=>{
        Loader.loadHTML(req, res, 'leaderboards.html');
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
        setQuizCompleted(req)
        Loader.loadHTML(req, res, 'quizFinish.html')
    })

    addRoute('POST', '/load-quiz-result', async (req, res) => {
        await QuizService.getQuizResults(req, res)
    })

    addRoute('GET', '/updateQuiz', async(req, res)=>{
        Loader.loadHTML(req, res, 'updateSqlQuery.html');
    }, checkAdminPrivileges)

    addRoute('GET', '/recover', async(req, res) => {
        Loader.loadHTML(req, res, 'recoverPass.html')
    })

    addRoute('POST', '/recover', async(req, res) => {
        LoginService.recoverPassword(req, res);
    })

    addRoute('GET', '/recover/verify', async(req, res) => {
        const query = parse(req.url, true).query;
        const token = query.token;
        if(!token){
            Loader.loadHTML(req, res, 'forbidden.html')
        }
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            currEmail = decoded.email
            Loader.loadHTML(req, res, 'resetPass.html');
        } catch(err){
            console.error('JWT Verification Error:', err);
            Loader.loadHTML(req, res, 'forbidden.html');
        }
        
    })

    addRoute('POST', '/recover/verify', async(req, res) => {
        LoginService.updatePassword(req, res, currEmail)
    })

    addRoute('GET', '/comments', async(req, res) => {
        const query = parse(req.url, true).query;
        const id = query.id;
        CommentService.getComments(req, res, id)
    })

    addRoute('POST', '/comments', async (req, res) => {
        CommentService.addComment(req, res)
    })

    addRoute('GET', '/after-create-quiz', async (req, res) => {
        await QuizService.handleFinishedCreateQuiz(req, res)
    })

    addRoute('GET', '/going-home', async (req, res) => {
        Loader.loadHTML(req, res, 'goingHome.html')
    })

    addRoute('GET', '/verify-problems', async(req, res) => {
        Loader.loadHTML(req, res, 'verifyProblems.html')
    }, checkAdminPrivileges)

    addRoute('GET', '/pending', async (req, res) => {
        await PendingService.getAll(req, res)
    })

    addRoute('POST', '/pending', async (req, res) => {
        await PendingService.handleAdminDecision(req, res)
    })
}

module.exports = routeHtml