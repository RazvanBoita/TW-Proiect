const url = require('url');
const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');

const checkSession = require('../utils/middleWare/checkSession');

const QuestionService = require('../services/questionService');
const CategoryService = require('../services/categoryService');
function routeJSON()
{
    addRoute('GET', '/quizzList', async (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pageIndex = parsedUrl.query.page || 0;
        
        if(pageIndex < 0)
            pageIndex = 0;

        const questions = await QuestionService.getPageQuestions(pageIndex);
        Loader.loadJSON(req, res, questions);
    }, checkSession)

    addRoute('GET', '/quizzCounter', async (req, res) => {
        const counter = await QuestionService.getQuestionsCounter();
        Loader.loadJSON(req, res, counter);
    }, checkSession)

    addRoute('GET', '/categoryList', async (req, res) => {
        const categories = await CategoryService.getCategoriesAsHTML();
        Loader.loadJSON(req, res, categories);
    }, checkSession)
  
}

module.exports = routeJSON;