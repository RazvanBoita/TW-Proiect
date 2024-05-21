const dbConnection = require('../config/postgresDB')


class SqlService {

    static async processQuery(req, res) {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {

                const { sql } = JSON.parse(body)
                // console.log(sql);
                const data = await SqlService.validateQuery(sql)
                res.statusCode = 200
                res.end(JSON.stringify(data))

            } catch (err) {
                console.log(err);
                res.statusCode = 500;
                res.end(JSON.stringify({ message: 'Internal Server Error' }));
            }
        })
    }

    static async validateQuery(sql) {

        let message = "Your answer is correct! Well done :)"
        //1 is solved
        //2 is wrong
        let statusCode = 1
        //should get the correct query considering the respective question ig
        const correctQuery = 'SELECT COUNT(*) FROM sql_tutoring.students WHERE firstName = \'John\';';
        try {
            await dbConnection.query("SET search_path TO sql_tutoring");
            const correctResult = await dbConnection.query(correctQuery)
            const userResult = await dbConnection.query(sql)

            const correctOutput = JSON.stringify(correctResult.rows)
            const userOutput = JSON.stringify(userResult.rows)

            // console.log("Correct output: " + correctOutput);
            // console.log("\nUser output: " + userOutput);

            if (!(userOutput == correctOutput)) {
                message = "Your answer is wrong... Try again?"
                statusCode = 2
            }

        } catch (err) {
            // console.log("Error: " + err);
            message = err.message
            statusCode = 2
            //aici sunt erorile de sintaxa pe care le trimitem
        }
        return { message, statusCode }
    }

}

module.exports = SqlService