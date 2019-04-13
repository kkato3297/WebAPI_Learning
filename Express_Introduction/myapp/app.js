var express = require('express'),
    app = express(),
    logger = require('morgan');	// Express 4.x ではexpress.logger()は使えなくなっているので、morganを使用してログを出力する。

// middleware
app.use(logger('dev'));
// Express 4.xでは不要
/*
 * app.use(express.logger('dev'));
 * app.use(app.router);
 */
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {
	console.log('my custom middleware !');
	next();
});

app.get('/hello.txt', function(req, res) {
	res.send('hello from app.js');
});

app.listen(3000);
console.log("server starting...");
