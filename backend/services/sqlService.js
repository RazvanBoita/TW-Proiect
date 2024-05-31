const dbConnection = require('../config/postgresDB');
const QuestionService = require('./questionService');


class SqlService {

    static async processQuery(req, res) {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {

                const { sql, questionId } = JSON.parse(body)

                const data = await SqlService.validateQuery(sql, questionId)
                res.statusCode = 200
                res.end(JSON.stringify(data))

            } catch (err) {
                console.log(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        })
    }

    static async validateQuery(sql, questionId) {
        
        let message = "Your answer is correct! Well done :)"

        //1 is solved
        //2 is wrong
        let statusCode = 1

        const correctQuery = await QuestionService.getAnswerByID(questionId)
        const correctAnswer = correctQuery.answer
        
        try {
            await dbConnection.query("SET search_path TO sql_tutoring");
            await dbConnection.query('BEGIN');
            const userResult = await dbConnection.query(sql)
            await dbConnection.query('ROLLBACK');

            await dbConnection.query('BEGIN');
            const correctResult = await dbConnection.query(correctAnswer)
            await dbConnection.query('ROLLBACK');

            
            const correctOutput = JSON.stringify(correctResult.rows)
            const userOutput = JSON.stringify(userResult.rows)

            // console.log("Correct output: " + correctOutput);
            // console.log("\nUser output: " + userOutput);

            if (!(userOutput == correctOutput)) {
                message = "Your answer is wrong... Try again?"
                statusCode = 2
            }

        } catch (err) {
            //aici daca trimite niste sql care nu e corect, sare direct in catch si nu termina tranzactia
            //de asta dau rollback, ca sa termin si in cazul asta tranzactia
            await dbConnection.query('ROLLBACK')
            message = err.message
            statusCode = 2
            //aici sunt erorile de sintaxa pe care le trimitem
        }
        return { message, statusCode }
    }

    

}

module.exports = SqlService