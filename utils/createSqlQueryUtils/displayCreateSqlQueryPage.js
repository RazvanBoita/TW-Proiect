const fs = require('fs');
const CategoryService = require('../../services/categoryService');

function displayPage(req, res, filePath)
{
    let categoryService = new CategoryService;

    categoryService.getAllCategories()
    .then(result=>
        {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end();
                    return;
                }

                let categoriesList = result[0];
                let options='';
                categoriesList.forEach(element=>
                {
                    options+=`<option value="${element.type}">${element.type}</option>`;
                });
                const modifiedHTML = data.toString().replace('<!--INSERT OPTIONS-->', options);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(modifiedHTML);
            });
        });
}
module.exports = {displayPage}