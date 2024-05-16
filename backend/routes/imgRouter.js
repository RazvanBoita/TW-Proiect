const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');


function routeImgs(){
    addRoute('GET', '/img/bg.png', (req, res) => {
        Loader.loadImage(req, res, 'bg.png')
    }); 
    addRoute('GET', '/img/liliac.png', (req, res) => {
        Loader.loadImage(req, res, 'liliac.png')
    }); 
}

module.exports = routeImgs