const QuizService = require('../services/quizService')
const AnswerService = require('../services/answerService')
const UserService = require('../services/userService')

// QuizService.insert(5, "Ce faci?", "Ce mai faci", "INSERT")
// QuizService.delete(5)

// AnswerService.insert(3, "Binisor")
// const id = 32
// AnswerService.exists(id).then(result => {
//     if(result){
//         AnswerService.delete(id)
//     } else{
//         console.log("The answer doesnt exist...");
//     }
// })

UserService.add("razvan@email.com", "Razvan", "Parola", 0)