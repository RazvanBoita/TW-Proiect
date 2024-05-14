const dataRouteHandler = (req, res) => {

    const username = "Razvan"
    // Respond with JSON data containing the username
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ username });
};

module.exports = dataRouteHandler;
