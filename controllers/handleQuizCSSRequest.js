const fs = require('fs')

function handleQuizCSSRequest(req, res){
    const filePath = './css/quiz.css'
    fs.readFile(filePath, (err, data) => {
        if(err){
            console.log("Error loading quiz css -> " + err);
            res.writeHead(500);
            res.end()
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/css'})
            res.end(data)
        }
    })
}

module.exports = handleQuizCSSRequest