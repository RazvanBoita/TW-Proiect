const fs = require('fs')
const QuizService = require('../services/quizService')

function quizController(req, res){
    switch(req.method){
        case "GET":
            console.log("Got get req");
            res.send(200)
        break
    }
}

module.exports = quizController;