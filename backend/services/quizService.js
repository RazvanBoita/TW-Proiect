const dbConnection = require('../config/postgresDB');
const { getUserData } = require('../utils/cookieHandler');
const TakenQuizService = require('./takenQuizService');

class QuizService{

    async insert(id, title, content, category){
        return QuizService.insertQuestion(id, title, content, category)
    }

    async delete(id){
        return QuizService.deleteByID(id)
    }

    static async insertQuestion(id, title, content, category){
        try {
            await dbConnection.query(
                'INSERT INTO quiz_questions (id, title, content, category) VALUES (?, ?, ?, ?)',
                [id, title, content, category]
            );
            console.log('Question inserted successfully:', title);
        } catch (error) {
            console.error('Error inserting question:', error.message);
        } finally{
            dbConnection.end()
        }
    }
    
    static async deleteByID(id){
        try {
            await dbConnection.query('DELETE FROM quiz_questions WHERE id = ?', [id]);
            console.log('Question removed successfully.');
        } catch (error) {
            console.error('Error removing question:', error.message);
        } finally {
            dbConnection.end();
        }
    }

    static async finishQuiz(req, res){
        let body = '';
        

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try{
                const user = getUserData(req)
                const userId = user.userId

                const {score, start_date} = JSON.parse(body)
                // console.log('Logging from quiz service: ' + score + start_date);  
                const end_date = new Date() 
                const end_timestamp = end_date.toISOString()
                
                // const userId = user.idUser
                // console.log(`For user id: ${userId}, add score: ${score}, start date: ${start_date}, end date: ${end_timestamp}`);
                const takenQuizId = await TakenQuizService.insert(userId, score, start_date, end_timestamp)

                res.statusCode = 200
                res.end(JSON.stringify(takenQuizId))
            }catch(err){
                console.log("Error at finishing quiz: " + err);
            }
        })
    }

    static async getQuizResults(req, res){
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try{
                const {encrypted} = JSON.parse(body)
                const quizId = parseInt(encrypted)
                const data = await this.getQuizInfo(quizId)
                
                if (!data) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Quiz not found' }));
                    return;
                }
                const { score, start_date, end_date } = data;

                res.statusCode = 200
                res.end(JSON.stringify({score, start_date, end_date}))
            } catch(err){
                console.log("Error retrieving quiz results: " + err);
            }
        })
    }

    static async getQuizInfo(quizId){
        try{
            const query = {
                text: `SELECT score, Start_date, End_date FROM sql_tutoring."taken_quizzes" WHERE id = $1`,
                values: [quizId]
            }
            const result = await dbConnection.query(query)
            if(result.rows.length > 0){
                return result.rows[0]
            } else{
                return null
            }
        } catch(err){
            console.log(err);
        }
    }
}

module.exports = QuizService