const QuestionService = require('../services/questionService')

QuestionService.getQuestionByID(62).then(result => {
    console.log(result);
})