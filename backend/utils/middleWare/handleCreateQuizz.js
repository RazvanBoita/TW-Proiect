const qs = require('querystring');
const QuestionService = require('../../services/questionService');
const CategoryService = require('../../services/categoryService');
const QuestionCategoryService = require('../../services/questionCategoryService');
const Loader = require('../../loaders/Loader');

const handleCreateQuizz =  async (req, res, next) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        let formData = qs.parse(body);
        
        try 
        {
            const difficulty = capitalizeFirstLetter(formData.difficulty);
            const questionData = await QuestionService.insertQuestion(formData.quizz_question, difficulty, formData.answer_area, formData.description_area);
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
    const categories = await CategoryService.getCategoriesAsHTML();
    const data = {
        categories,
        errorMessage: "Question already exists!",
    };
    Loader.loadTemplateEngineHTML(req, res, 'createSqlQuery.hbs', data);
}
<<<<<<< HEAD
=======

>>>>>>> 41f7560f1c9ecc988d46874332dc6f9f7135646a
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
module.exports = handleCreateQuizz;