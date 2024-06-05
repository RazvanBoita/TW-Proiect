const url = require('url');
const {addRoute, use} = require('../../router');
const {getUserData} = require('../utils/cookieHandler');
const Loader = require('../loaders/Loader');

const checkSession = require('../utils/middleWare/checkSession');

const QuestionService = require('../services/questionService');
const CategoryService = require('../services/categoryService');
const SolvedQuestionsService = require('../services/solvedQuestionsService');
const TakenQuizService = require('../services/takenQuizService');
const LeaderboardService = require('../services/leaderboardService');
function routeJSON()
{
    addRoute('GET', '/quizzList', async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pageIndex = parsedUrl.query.page || 0;
        if(pageIndex < 0)
            pageIndex = 0;
        
        let difficulty = `%${parsedUrl.query.difficulty}`;
        if(parsedUrl.query.difficulty === undefined || parsedUrl.query.difficulty === '')
        {
            difficulty='%';
        }
        let categoryId = parsedUrl.query.categoryId; 
        if(categoryId === undefined)
        {
            categoryId = '';
        }
        
        const questions = await QuestionService.getPageQuestions(pageIndex, difficulty, categoryId);
        Loader.loadJSON(req, res, questions);
    }, checkSession)

    addRoute('GET', '/quizzCounter', async (req, res) => {
        const parsedUrl = url.parse(req.url, true);

        let difficulty = `%${parsedUrl.query.difficulty}`;
        if(parsedUrl.query.difficulty === undefined || parsedUrl.query.difficulty === '')
        {
            difficulty='%';
        }

        let categoryId = parsedUrl.query.categoryId; 
        if(categoryId === undefined)
        {
            categoryId = '';
        }
        
        const counter = await QuestionService.getQuestionsCounter(difficulty, categoryId);
        Loader.loadJSON(req, res, counter);
    }, checkSession)

    addRoute('GET', '/categoryList', async (req, res) => {
        const categories = await CategoryService.getCategoriesAsHTML();
        Loader.loadJSON(req, res, categories);
    }, checkSession)
  
    addRoute('GET', '/problemsProgress', async (req, res)=>{
        const easyProblemsCounter = await QuestionService.getQuestionsCounter('%Easy', ''); // Get the easy questions, the second parameter is for categoryId, leave it empty
        const mediumProblemsCounter = await QuestionService.getQuestionsCounter('%Medium', '');
        const hardProblemsCounter = await QuestionService.getQuestionsCounter('%Hard', '');

        const allProblemsCounter =  parseInt(easyProblemsCounter[0].count) + parseInt(mediumProblemsCounter[0].count) + parseInt(hardProblemsCounter[0].count);
        
        const userId = getUserData(req).userId;
        const allProblemsSolvedCounter = await SolvedQuestionsService.getQuestionsSolvedByUserCounter(userId);
        const easyProblemsSolvedCounter = await SolvedQuestionsService.getQuestionsSolvedByUserCounter(userId, '%Easy');
        const mediumProblemsSolvedCounter = await SolvedQuestionsService.getQuestionsSolvedByUserCounter(userId, '%Medium');
        const hardProblemsSolvedCounter = await SolvedQuestionsService.getQuestionsSolvedByUserCounter(userId, '%Hard');
        const data = {
            easyProblemsCounter: easyProblemsCounter[0].count,
            mediumProblemsCounter: mediumProblemsCounter[0].count,
            hardProblemsCounter: hardProblemsCounter[0].count,
            allProblemsCounter,
            allProblemsSolvedCounter,
            easyProblemsSolvedCounter,
            mediumProblemsSolvedCounter,
            hardProblemsSolvedCounter
        }
        Loader.loadJSON(req, res, data);
    }, checkSession)
    addRoute('GET', '/solvedQuizzesList', async (req, res)=>{
        const parsedUrl = url.parse(req.url, true);
        const pageIndex = parsedUrl.query.page || 0;

        const userId = getUserData(req).userId;
        const data = await SolvedQuestionsService.getQuestionsSolvedByUserData(userId, pageIndex);
        Loader.loadJSON(req, res, data);
    }, checkSession)

    addRoute('GET', '/userStats', async (req, res)=>{

        const user = getUserData(req);
        const highScore = await TakenQuizService.getHighestScore(user.userId);
        let rank = await LeaderboardService.getUserRank(user.userId);
        if(!rank)
        {
            rank = 'Unkown';
        }
        const data = {
            username : user.username,
            highScore,
            rank,
            
        }
        Loader.loadJSON(req, res, data);
    }, checkSession)
}



module.exports = routeJSON;