const fs = require('fs');
const CategoryService = require('../../services/categoryService');

function displayPage(req, res, filePath)
{
    fs.readFile(filePath, async (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
            return;
        }

        let categoriesHTML = await CategoryService.getCategoriesAsHTML();
        const modifiedHTML = data.toString().replace('<!--INSERT OPTIONS-->', categoriesHTML);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(modifiedHTML);
    });
}
module.exports = {displayPage}