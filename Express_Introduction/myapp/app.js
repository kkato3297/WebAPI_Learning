var express = require('express'),
    app = express();

// Express 4.xでは不要
/*
 * app.use(app.router);
 */
app.use(express.static(__dirname + '/public'));

app.get('/hello.txt', function(req, res) {
	res.sendFile(__dirname + '/public/hello.txt');
});

app.listen(3000);
console.log("server starting...");
