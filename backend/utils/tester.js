const QuestionService = require('../services/questionService')

QuestionService.serveQuestion().then(result => {
    console.log(result);
})