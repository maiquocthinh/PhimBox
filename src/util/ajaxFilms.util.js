// const Categories = require('../app/models/category.models');
const Users = require('../app/models/user.models');


function arrayToCategories(arrayCategories, listCategories) {
    const listHtmlCategories = arrayCategories.map((categoryItem) => {
        for (const element of listCategories) {
            if (parseInt(categoryItem) === element._doc.category_id) {
                return `<span class="badge rounded-pill text-white bg-gradient-cosmic">${element._doc.category_name}</span>`;
            }
        }
    }).join('');
    return listHtmlCategories;
}

function getUserById(id, listUsers) {
    for (const userItem of listUsers) {
        if (id === userItem.user_id) {
            return userItem.user_name;
        }
    }
}

module.exports = {
    arrayToCategories,
    getUserById,
};