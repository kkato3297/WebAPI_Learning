var express = require('express'),
    app = express(),
    logger = require('morgan');	// Express 4.x ではexpress.logger()は使えなくなっているので、morganを使用してログを出力する。

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// middleware
app.use(logger('dev'));
// Express 4.xでは不要
/*
 * app.use(express.logger('dev'));
 * app.use(app.router);
 */
app.use(express.static(__dirname + '/public'));

app.param('id', function(req, res, next, id) {
	var users = ['taguchi', 'fkoji', 'dotinstall'];
	req.params.name = users[id];
	next();
});
app.get('/hello/:id', function(req, res) {
	res.send('hello ' + req.params.name);
});
app.get('/bye/:id', function(req, res) {
	res.send('bye ' + req.params.name);
});

app.listen(3000);
console.log("server starting...");
