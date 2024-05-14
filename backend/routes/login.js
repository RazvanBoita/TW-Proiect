class loginRouteHandler{
    
    static loginGet(req, res){
        //trimitem direct catre service
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('This is the login route(GET)');
    }

    static loginPost(req, res){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('This is the login route(POST)');
    }
};

module.exports = loginRouteHandler;