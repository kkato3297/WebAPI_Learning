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

app.get('/', function(req, res) {
	res.render('index', {title: 'title'});
});

app.listen(3000);
console.log("server starting...");
