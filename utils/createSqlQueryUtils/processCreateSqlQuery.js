const fs = require('fs');
const qs = require('querystring');
const crypto = require('crypto');
const UserData = require('../../models/userData');
const dbConnection  = require('../../config/database'); 
const cookieHandler = require('../cookieHandler');

const QuestionService = require('../../services/questionService');
const CategoryService = require('../../services/categoryService');
const QuestionCategoryService = require('../../services/questionCategoryService');

function processCreateSqlQuery(req, res, filePath)
{
  fs.readFile(filePath, async (err, data) => {
    if(err)
    {
        res.writeHead(500);
        res.end();
        return;
    }
    let categoriesHTML = await CategoryService.getCategoriesAsHTML();
    let modifiedHTML = data.toString().replace('<!--INSERT OPTIONS-->', categoriesHTML);
    handleCreateSqlQuery(req, res)
    .then(result=>{

        const userData = cookieHandler.getUserData(req);

        if(userData === null)
        {
            res.writeHead(500);
            res.end();
            return;
        }

        // If the user is not admin, redirect him to the menu page
        if(userData.isAdmin === 0)
        {
            res.writeHead(302, {'Location': '/'});
            res.end(data);
        }
        else
        {
            const successMessage = '<p id="success-message">Question added successfuly</p>'
            modifiedHTML = modifiedHTML.replace('<!-- STATUS MESSAGE -->', successMessage);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedHTML);
        }
    })
    .catch(error =>{
        const errorMessage = `<p id="error-message">Error adding question: ${error}</p>`
        modifiedHTML = modifiedHTML.replace('<!-- STATUS MESSAGE -->', errorMessage);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modifiedHTML);
    })
});
}
function handleCreateSqlQuery(req, res) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        let formData = qs.parse(body);
        
        try 
        {
            const questionData = await QuestionService.insertQuestion(formData.quizz_question, formData.difficulty, formData.answer_area);
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
            resolve('Insert successful!');
            
        } catch (error) {
            reject(error);
        }
      });
    });
}

module.exports = {processCreateSqlQuery}