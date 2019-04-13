var express = require('express'),
    app = express(),
    logger = require('morgan'),	// Express 4.x ではexpress.logger()は使えなくなっているので、morganを使用してログを出力する。
    bodyParser = require('body-parser');	// Express 4.x ではexpress.json() / express.urlencoded()が使えないので、別途ミドルウェアをインストールして設定する必要がある

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// middleware
/*
 * // Express 4.x未満では下記の通り
 * app.use(express.json());
 * app.use(express.urlencoded());
 */
// Express 4.xでは下記の通り
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('dev'));
// Express 4.xでは不要
/*
 * app.use(express.logger('dev'));
 * app.use(app.router);
 */
app.use(express.static(__dirname + '/public'));

app.get('/new', function(req, res) {
	res.render('new');
});
app.post('/create', function(req, res) {
	res.send(req.body.name);
});

app.listen(3000);
console.log("server starting...");
