const qs = require('querystring');
const QuestionService = require('../../services/questionService');
const CategoryService = require('../../services/categoryService');
const QuestionCategoryService = require('../../services/questionCategoryService');
const Loader = require('../../loaders/Loader');
const PendingService = require('../../services/pendingService');
const { isUserAdmin } = require('../cookieHandler');
const { log } = require('handlebars/runtime');

const handleCreateQuizz =  async (req, res, next) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        let formData = qs.parse(body);
        
        try 
        {
            if(!isUserAdmin(req)){
                let categoryList = [];
                if (Array.isArray(formData.category)) {
                    categoryList.push(...formData.category);
                } 
                else if (typeof formData.category === 'string') {
                    categoryList.push(formData.category); 
                }
                let intList = await buildIntList(categoryList)
                await PendingService.insertQuestion(formData.difficulty, formData.quizz_question, formData.answer_area, formData.description_area, formData.hint_area, intList)
            } else{
                const difficulty = capitalizeFirstLetter(formData.difficulty);
                if(formData.hint_area === '')
                    formData.hint_area = 'None';
                    
                const questionData = await QuestionService.insertQuestion(formData.quizz_question, difficulty, formData.answer_area, formData.description_area, formData.hint_area);
                // Error at inserting question into db
                if(questionData === null)
                {
                    throw 'Question already exists';
                }
                let categoryList = [];

                if (Array.isArray(formData.category)) {
                    categoryList.push(...formData.category);
                } 
                else if (typeof formData.category === 'string') {
                    categoryList.push(formData.category); 
                }
                
                categoryList.forEach(async category=>
                {
                    const categoryData = await CategoryService.getCategory(category);
                    if(categoryData === null)
                        return;

                    QuestionCategoryService.insertQuestionCategory(questionData.id, categoryData.id);
                    
                });
                
                console.log('Insert successful!');
            }
            
        } catch (error) {
            console.log(`Error at creating quizz:${error} `);
            showErrorMessage(req, res);
            return;
        }
        next();
      });
}

async function showErrorMessage(req, res)
{
    const categories = await CategoryService.getCategories();
    const data = {
        categories,
        errorMessage: "Question already exists!",
    };
    Loader.loadHTML(req, res, 'createSqlQuery.html');
}
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


async function buildIntList(categoryList) {
    const intList = await Promise.all(categoryList.map(async (category) => {
        const categoryData = await CategoryService.getCategory(category);
        return categoryData.id;
    }));

    return intList
}
module.exports = handleCreateQuizz;