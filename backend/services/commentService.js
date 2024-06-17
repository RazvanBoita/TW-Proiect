const dbConnection = require('../config/postgresDB');
const { getUserData } = require('../utils/cookieHandler');
const QuestionService = require('./questionService');

class CommentService{
    static async getComments(req, res, postId){
        //check if post exists?
        try {
            const query = {
                text: `SELECT * FROM sql_tutoring."Comment" WHERE "idQuestion" = $1`,
                values: [postId]
            }
            const result = await dbConnection.query(query)
            
            const comments = result.rows.map(row => ({
                id: row.id,
                idQuestion: row.idQuestion,
                idUser: row.idUser,
                parentId: row.parentId,
                description: row.description,
                createdAt: row.createdAt,
            }));


            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(comments));
        } catch (error) {
            console.error('Error fetching comments:', error.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    }

    static async addComment(req, res){
        let body = '';
        

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try{
                const user = getUserData(req)
                const userId = user.userId
                const {questionId, parentId, description} = JSON.parse(body)

                //verifica faptul ca questionId exista
                if(QuestionService.getQuestionByID(questionId) == null){
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Question not found' }));
                }

                const query = {
                    text: `INSERT INTO sql_tutoring."Comment" ("idQuestion", "idUser", "parentId", "description", "createdAt") 
                           VALUES ($1, $2, $3, $4, NOW()) 
                           RETURNING *`,
                    values: [questionId, userId, parentId || -1, description]
                };
                const result = await dbConnection.query(query);

                if (result.rows.length > 0) {
                    const newComment = result.rows[0];
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(newComment));
                } else {
                    throw new Error('Failed to insert comment');
                }

            } catch(err){
                console.log("Error adding comment: " + err);
                res.statusCode = 406;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        })
    }
}

module.exports = CommentService;