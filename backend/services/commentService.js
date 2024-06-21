const dbConnection = require('../config/postgresDB');
const { getUserData } = require('../utils/cookieHandler');
const QuestionService = require('./questionService');
const UserService = require('./userService')

class CommentService {
    static async getComments(req, res, postId) {
        try {
            const query = {
                text: `SELECT * FROM sql_tutoring."Comment" WHERE "idQuestion" = $1`,
                values: [postId]
            };
            const result = await dbConnection.query(query);

            const userIds = result.rows.map(row => row.idUser);
            const userNamesPromises = userIds.map(userId => UserService.getNameById(userId));
            const userNames = await Promise.all(userNamesPromises);

            const comments = result.rows.map((row, index) => ({
                id: row.id,
                idQuestion: row.idQuestion,
                idUser: userNames[index],
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

    static async addComment(req, res) {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const user = getUserData(req);
                const userId = user.userId;
                const { questionId, parentId, description } = JSON.parse(body);

                // Check if questionId exists
                if (!QuestionService.getQuestionByID(questionId)) {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: 'Question not found' }));
                    return;
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
                    const username = await UserService.getNameById(newComment.idUser)
                    const createdAtDate = new Date(newComment.createdAt).toLocaleDateString('en-US')
                    const commentHtml = `
                        <div class="comment">
                            <div class="comment-content">${newComment.description}</div>
                            <div class="comment-bottom">
                                <div class="comment-user">
                                    <ion-icon name="person-circle-outline"></ion-icon>
                                    <p class="comment-username">${username}</p>
                                </div>
                                <p class="comment-date">Date: ${createdAtDate}</p>
                            </div>
                        </div>
                    `;
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(commentHtml));
                } else {
                    throw new Error('Failed to insert comment');
                }
            } catch (err) {
                console.log("Error adding comment: " + err);
                res.statusCode = 406;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });
    }
}

module.exports = CommentService;
