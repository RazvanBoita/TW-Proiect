const { use } = require("../../router");
const Loader = require("../loaders/Loader");
const bodyParser = require("../utils/middleWare/bodyParser");

use(bodyParser)


function signUp(req, res){
    console.log(req.body);
    let code = 200
    return code
}

module.exports = signUp