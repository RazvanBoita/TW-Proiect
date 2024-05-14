const quizzRouteHandler = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('This is the quizz route');
    console.log(req.user);
};

module.exports = quizzRouteHandler;