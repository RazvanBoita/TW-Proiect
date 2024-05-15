const http = require('http');
const dotenv = require('dotenv');
const {addRoute, handleRequest, use} = require('./router')
const quizzRouteHandler = require('./backend/routes/quizz')
const loginRouteHandler = require('./backend/routes/login')
const jwtMiddleware = require('./backend/utils/middleWare/jwtMiddleware')
const generateToken = require('./backend/utils/generateToken')
const bodyParser = require('./backend/utils/middleWare/bodyParser');
const indexHandler = require('./backend/routes');
const Loader = require('./backend/loaders/Loader');
const routeCss = require('./backend/routes/cssRouter');
const routeImgs = require('./backend/routes/imgRouter');


dotenv.config();

use(bodyParser) //node nu ne lasa sa accesam req.body, asa ca e nevoie de aceasta functie care sa l parseze

//  generateToken() //luam un token sa verificam ca merge, asta ar trb facuta la login
//aici adaugam toate rutele posibile

addRoute('POST', '/login', loginRouteHandler.loginPost);
addRoute('GET', '/login', loginRouteHandler.loginGet);
addRoute('GET', '/quiz', quizzRouteHandler, jwtMiddleware)


//aici dam serve la toate fisierele css
//faci un nou fisier css, vii aici, pe modelul asta il adaugi
routeCss()
routeImgs()

addRoute('GET', '/', indexHandler.get)


const server = http.createServer(handleRequest);

const PORT = process.env.SERVER_PORT;
server.listen(PORT, ()=>console.log('Server: ' + `http://localhost:${process.env.SERVER_PORT}`));