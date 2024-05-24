const dbConnection = require('../config/postgresDB')
const QuestionData = require('../models/questionData');

class QuestionService{

    static async insertQuestion(title, difficulty, answer, description){
        let questionData = null;
        let counter = 0;
        try 
        {
            const insertQuery = {
                text: 'INSERT INTO sql_tutoring."Question" (title, difficulty, answer, counter, description) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                values: [title, difficulty, answer, counter, description],
              };
            
            const result =  await dbConnection.query(insertQuery);
            const id = result.rows[0].id;
            questionData = new QuestionData(id, title, difficulty, answer, counter, description);
        }
         catch (error) {
            console.error('Error executing INSERT query for Question table:', error);
        }
        return questionData;
    }
    
    //! deprecated
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

    static async getQuestionByID(id) {
        let questionData = null;
        try {
            const query = {
                text: 'SELECT * FROM sql_tutoring."Question" WHERE id = $1',
                values: [id],
            };
    
            const result = await dbConnection.query(query);
            if (result.rows.length === 1) {
                const { id, title, difficulty, answer, counter, description, rating } = result.rows[0];
                questionData = new QuestionData(id, title, difficulty, answer, counter, description, rating);
            }
        } catch (error) {
            console.error('Error retrieving question:', error.message);
        }
        return questionData;
    }

    static async fetchQuestion(){
        // fetch it from somewhere
        const question = await this.getQuestionByID(79) //chosen id by the algo
        const tableDescription = question.description
        const formattedDescription = tableDescription.replace(/\t/, "    ")
        const data = {
            currentQuestion: 1,
            questionContent: question.title,
            tableDescription: formattedDescription
        }
        return data
    }

    static async serveQuestion(){
        //data should be imported by another service
        const data = QuestionService.fetchQuestion()
        return data
    }

    static async handleNextQuestion(req, res){
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try{
                const {index} = JSON.parse(body)
                let newIndex = parseInt(index)
                let type = '';
                if(newIndex<=4){
                    type = 'Easy'
                }
                else if(newIndex>4 && newIndex<= 8){
                    type = 'Medium'
                } else if(newIndex > 8 && newIndex <= 12){
                    type = 'Hard'
                } 
                if(newIndex == 13){
                    res.writeHead(200, { 'Content-Type': 'plain/text' });
                    res.end("STOP THE APP")
                    return
                }
                this.chooseQuestionAlgo(type)
                const {id, title, difficulty, description} = await this.getQuestionByID(64)
                const data = {id, title, difficulty, description}

                console.log("Currently on question: " + index);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data))
            } catch(err){
                console.log(err);
            }
        })   
    }

    static async getQuestionsByDifficulty(difficulty) {
        try {
            const query = 'SELECT * FROM sql_tutoring."Question" WHERE difficulty = $1';
            const values = [difficulty];
            const result = await dbConnection.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error fetching questions by difficulty:', error);
        }
    }


    static async chooseQuestionAlgo(difficulty){
        // console.log("Choosing a " + difficulty + " question!");
        const questions = await this.getQuestionsByDifficulty(difficulty)
        //TODO dont pick the same question twice, also choose it based on the counter
    }
}

module.exports = QuestionService