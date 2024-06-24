const CategoryService = require('../services/categoryService')

const categoryList = ["UPDATE", "DELETE", "SELECT"]

async function buildIntList() {
    const intList = await Promise.all(categoryList.map(async (category) => {
        const categoryData = await CategoryService.getCategory(category);
        return categoryData.id;
    }));

    console.log(intList);
}

buildIntList();