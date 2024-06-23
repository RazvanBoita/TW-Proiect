const dbConnection = require('../config/postgresDB');
const QuestionService = require('./questionService');


class PendingService{
    static async insertQuestion(difficulty, title, answer, description, hint){
        try{
            const insertQuery = {
                text: 'INSERT INTO sql_tutoring."Pending" (title, difficulty, hint, answer, description) VALUES ($1, $2, $3, $4, $5)',
                values: [title, difficulty, hint, answer, description],
            };
            await dbConnection.query(insertQuery)
        } catch(err){
            console.log("Error adding question to pending: " + err);
        }
    }

    static async getAll(req, res){
        try{
            const query = {
                text: 'SELECT * FROM sql_tutoring."Pending"'
            }
            const result = await dbConnection.query(query)
            const data = result.rows
            res.statusCode = 200
            res.end(JSON.stringify(data))
        } catch(err){
            res.statusCode = 500
            res.end(JSON.stringify({msg: "Internal server error"}))
            console.log("Error retrieveing all pending questions: " + err);
        }
    }

    static async handleAdminDecision(req, res){
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const {action, questionId} = JSON.parse(body)
            if(action === 'deny') this.deleteQuestion(questionId)
            if(action === 'approve') this.transferQuestion(questionId)
        })
    }

    static async deleteQuestion(questionId){
        try{
            const query = {
                text: 'DELETE FROM sql_tutoring."Pending" WHERE id = $1',
                values: [questionId]
            }
            await dbConnection.query(query)
        } catch(err){
            console.log("Error deleting question from pending: " + err);
        }
    }

    static async getDataById(questionId){
        try{
            const query = {
                text: 'SELECT * FROM sql_tutoring."Pending" WHERE id = $1',
                values: [questionId]
            }
            const result = (await dbConnection.query(query)).rows[0]
            return result
        } catch(err){
            console.log("Error getting data for pending question: " + err);
            return null
        }
    }        

    //adica muta in intrebarile bune
    static async transferQuestion(questionId){
        const res = await this.getDataById(questionId)
        if(res == null || res == undefined){
            throw new Error("Data doesn't exist for question id " + questionId)
        }
        try{
            await QuestionService.insertQuestion(res.title, res.difficulty, res.answer, res.description, res.hint)
            await this.deleteQuestion(questionId)
        } catch(err){
            console.log("Error transfering question from pending: " + err);
        }
    }
}

module.exports = PendingService