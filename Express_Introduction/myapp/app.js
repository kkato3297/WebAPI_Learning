var express = require('express'),
    app = express();

// middleware
// Express 4.xでは不要
/*
 * app.use(app.router);
 */
app.use(express.static(__dirname + '/public'));

app.get('/hello.txt', function(req, res) {
	res.send('hello from app.js');
});

app.listen(3000);
console.log("server starting...");
