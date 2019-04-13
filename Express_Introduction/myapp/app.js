var express = require('express'),
    app = express();

// Express 4.xでは不要
/*
 * app.use(app.router);
 */

app.get('/', function(req, res) {
	res.send('hello world');
});
app.get('/about', function(req, res) {
	res.send('about this page!');
});

app.listen(3000);
console.log("server starting...");
