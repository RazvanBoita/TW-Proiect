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
<<<<<<< HEAD
<<<<<<< HEAD
            const questionData = await QuestionService.insertQuestion(formData.quizz_question, formData.difficulty, formData.answer_area, formData.description_area);
=======
            const questionData = await QuestionService.insertQuestion(formData.quizz_question, formData.difficulty, formData.answer_area);
>>>>>>> 1f479ca (Added create quizz logic)
=======
            const questionData = await QuestionService.insertQuestion(formData.quizz_question, formData.difficulty, formData.answer_area, formData.description_area);
>>>>>>> a2fb353 (Refactor frontend createQuizz)
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

module.exports = handleCreateQuizz;