const CategoryService = require('../services/categoryService')

CategoryService.getQuestionCategories(59).then(res => {
    const types =  res.map(item => item.type)
    console.log(types.toString());
})