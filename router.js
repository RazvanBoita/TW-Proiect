const url = require('url');

const routes = {};
const middlewares = [];

const addRoute = (method, path, handler, middleware) => {
    if (!routes[method]) {
        routes[method] = {};
    }
    routes[method][path] = { handler, middleware };
};

const use = (middleware) => {
    middlewares.push(middleware);
};

const handleRequest = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const path = parsedUrl.pathname;

    let index = 0;

    const next = () => {
        if (index < middlewares.length) {
            const middleware = middlewares[index++];
            middleware(req, res, next);
        } else if (routes[method] && routes[method][path]) {
            const { handler, middleware: routeMiddleware } = routes[method][path];
            if (routeMiddleware) {
                routeMiddleware(req, res, () => handler(req, res));
            } else {
                handler(req, res);
            }
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not Found');
        }
    };

    next();
};

module.exports = {
    addRoute,
    use,
    handleRequest
};
