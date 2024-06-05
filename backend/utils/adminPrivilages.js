const cookieHandler = require('./cookieHandler');

class AdminPrivilages{
    static getCreateQuizzButton(req) {
        return cookieHandler.isUserAdmin(req);
    }
}
module.exports = AdminPrivilages;