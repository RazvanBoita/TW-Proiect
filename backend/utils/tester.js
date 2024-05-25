const QuestionService = require('../services/questionService')

const givenid = 60;

QuestionService.getAnswerByID(givenid).then(result => {
    console.log(result);
})