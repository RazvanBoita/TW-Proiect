const http = require('http');
const dotenv = require('dotenv');
const { handleRequest } = require('./router')
const routeCss = require('./backend/routes/cssRouter');
const routeImgs = require('./backend/routes/imgRouter');
const routeHtml = require('./backend/routes/htmlRouter');
const routeJs = require('./backend/routes/jsRouter');

const fs = require('fs');
const path = require('path');


dotenv.config();

//Routes
routeCss()
routeImgs()
routeHtml();
routeJs();



const server = http.createServer(handleRequest);

const PORT = process.env.SERVER_PORT;
server.listen(PORT, ()=>console.log('Server: ' + `${process.env.BASE_URL}`));