const CategoryService = require('../services/categoryService')

CategoryService.getQuestionCategories(59).then(res => console.log(res[0].type))