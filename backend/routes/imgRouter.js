const {addRoute} = require('../../router');
const Loader = require('../loaders/Loader');


function routeImgs(){


    addRoute('GET', '/img/bg.png', (req, res) => {
        Loader.loadImage(req, res, 'bg.png')
    }); 

    addRoute('GET', '/img/liliac.png', (req, res) => {
        Loader.loadImage(req, res, 'liliac.png')
    });

    addRoute('GET', '/frontend/img/bg.png', (req, res) => {
        Loader.loadImage(req, res, 'bg.png')
    }); 

    addRoute('GET', '/img/vector.svg', (req, res) => {
        Loader.loadImage(req, res, 'vector.svg')
    })

    addRoute('GET', '/img/createAcc.png', (req, res) => {
        Loader.loadImage(req, res, 'createAcc.png')
    })

    addRoute('GET', '/img/update.png', (req, res) => {
        Loader.loadImage(req, res, 'update.png')
    })

    addRoute('GET', '/img/review.png', (req, res) => {
        Loader.loadImage(req, res, 'review.png')
    })

    addRoute('GET', '/img/select.png', (req, res) => {
        Loader.loadImage(req, res, 'select.png')
    })



}

module.exports = routeImgs