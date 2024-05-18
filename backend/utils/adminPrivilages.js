const cookieHandler = require('./cookieHandler');

class AdminPrivilages{
    static getCreateQuizzButton(req) {
        if(!cookieHandler.isUserAdmin(req))
            return "display: none;";

        return "visibility: visible;"
    }
}
module.exports = AdminPrivilages;