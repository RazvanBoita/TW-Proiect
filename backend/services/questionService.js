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
            questionData = new QuestionData(id, title, difficulty, answer, counter, description, 0);
        }
         catch (error) {
            console.error('Error executing INSERT query for Question table:', error);
        }
        return questionData;
    }
    static async getAllQuestions()
    {
        const results = await dbConnection.query('SELECT * FROM sql_tutoring."Question"');
        const rows = results.rows;
        const questions = rows.map(element => {
            return { id: element.id, title: element.title, difficulty: element.difficulty, rating: element.rating };
        });
        return questions;
        
    }
    static async getPageQuestions(pageIndex, difficulty, categoryId)
    {
        const maxQuestions = 10;
        let queryText = 'SELECT q.* FROM sql_tutoring."Question" q ';
        let params = [];
        let index = 1;
        if(categoryId !== '')
        {
            queryText+=`JOIN sql_tutoring."Question_Category" qc ON q.id = qc.id_question JOIN sql_tutoring."Category" c ON qc.id_category = c.id AND c.id = $${index} `;
            params.push(categoryId);
            index++;
        }

        queryText+=`WHERE q.difficulty LIKE $${index} ORDER BY q.id LIMIT $${index + 1} OFFSET $${index + 2}`;
        params.push(difficulty);
        params.push(maxQuestions);
        params.push(pageIndex * maxQuestions);
        try{
            const selectQuery = {
                text: queryText,
                values: params,
            }

            const result =  await dbConnection.query(selectQuery);
            const rows = result.rows;
            const questions = rows.map(element => {
            return { id: element.id, title: element.title, difficulty: element.difficulty, rating: element.rating };
            });
            
            return questions;
        }
        catch(error){
            console.error('Error executing SELECT LIMIT query for Question table:', error);
        }
    }
    static async getQuestionsCounter(difficulty, categoryId)
    {
        let queryText = 'SELECT COUNT(*) FROM sql_tutoring."Question" q ';
        let params = [];
        let index = 1;
        if(categoryId !== '')
        {
            queryText+=`JOIN sql_tutoring."Question_Category" qc ON q.id = qc.id_question JOIN sql_tutoring."Category" c ON qc.id_category = c.id AND c.id = $${index} `;
            params.push(categoryId);
            index++;
        }

        queryText+=`WHERE q.difficulty like $${index}`;
        params.push(difficulty);
        try{
            const selectQuery = {
                text: queryText,
                values: params,
            }
            const result =  await dbConnection.query(selectQuery);

            return result.rows;
        }
        catch(error){
            console.error('Error executing SELECT LIMIT query for Question table:', error);
        }
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

    static async getAnswerByID(id){
        try {
            const query = {
                text: 'SELECT answer FROM sql_tutoring."Question" WHERE id = $1',
                values: [id],
            };
    
            const result = await dbConnection.query(query);
            if (result.rows.length) {
                return result.rows[0]
            }
        } catch (error) {
            console.error('Error retrieving answer:', error.message);
            return
        }
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
                
                //? Easy questions are 5 points  
                //? Medium questions are 8 points  
                //? Hard questions are 12 points  
                const {index, pickedQuestions, isCorrect, vote, currentQuestion} = JSON.parse(body)
                // console.log("Picked questions are: " + pickedQuestions);

                let newIndex = parseInt(index)
                let points = 0
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
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end("STOP THE APP")
                    return
                }
                
                if(isCorrect){
                   if(newIndex - 1 <=4) points = 5
                   else if(newIndex - 1 <=8) points = 8
                   else if(newIndex-1 <=12) points = 12
                   else console.log("Unknown points");
                }
                
                const voteNo = parseInt(vote)
                const currQuestionId = parseInt(currentQuestion)
                if(vote!=0){
                    this.updateQuestionRating(voteNo, currQuestionId)
                }

                const pickedQuestion = await this.chooseQuestionAlgo(type, pickedQuestions)

                const {id, title, difficulty, description, hint} = pickedQuestion
                // console.log(id, title, difficulty, description);
                const data = {id, title, difficulty, description, points, hint}

                // console.log("Currently on question: " + index);

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


    static async chooseQuestionAlgo(difficulty, pickedQuestions) {
        // console.log("Choosing a " + difficulty + " question!");
      
        const questions = await this.getQuestionsByDifficulty(difficulty);
      
        if (questions.length === 0) {
          console.log('No ' + difficulty + ' questions found.');
          return null;
        }
      
        const filteredQuestions = questions.filter(question => !pickedQuestions.includes(question.id));
      
        if (filteredQuestions.length === 0) {
          console.log('No unpicked ' + difficulty + ' questions found.');
          return null;
        }
      
        let minCounterQuestion = filteredQuestions[0];
        for (const question of filteredQuestions) {
          if (question.counter < minCounterQuestion.counter) {
            minCounterQuestion = question;
          }
        }
        await this.updateQuestionCounter(minCounterQuestion.id)
        return minCounterQuestion;
      }


    static async chooseFirstQuestion() {
        try {
            const easyQuestions = await this.getQuestionsByDifficulty('Easy');
            if (easyQuestions.length === 0) {
                console.log('No easy questions found.');
                return null;
            }
            let minCounterQuestion = easyQuestions[0];
            for (const question of easyQuestions) {
                if (question.counter < minCounterQuestion.counter) {
                    minCounterQuestion = question;
                }
            }
            await this.updateQuestionCounter(minCounterQuestion.id)
            const title = minCounterQuestion.title
            const description = minCounterQuestion.description
            const now = new Date()
            const hint = minCounterQuestion.hint
            const data = {
                currentQuestion : 1,
                questionContent: title,
                tableDescription: description,
                questionId: minCounterQuestion.id,
                start_date: now,
                hint: hint
            }
            return data;
        } catch (error) {
            console.error('Error choosing the first question:', error);
        }
    }


    static async updateQuestionCounter(questionId) {
        try {
            const query = 'UPDATE sql_tutoring."Question" SET counter = counter + 1 WHERE id = $1';
            const values = [questionId];
            await dbConnection.query(query, values);
        } catch (error) {
            console.error('Error updating question counter:', error);
        }
    }


    static async updateQuestionRating(vote, currQuestionId){
        try{
            const incrementValue = vote === 1 ? 1 : -1;
            const query = {
                text: 'UPDATE sql_tutoring."Question" SET rating = rating + $1 WHERE id = $2',
                values: [incrementValue, currQuestionId],
            };

            await dbConnection.query(query);
        } catch (error) {
            console.error('Error updating question rating:', error.message);
        }   
    }

}

module.exports = QuestionService