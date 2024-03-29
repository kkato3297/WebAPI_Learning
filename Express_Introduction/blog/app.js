var express = require('express'),
    app = express(),
    post = require('./routes/post'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    connect = require('connect'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    csrf = require('csurf');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride(function(req, res){
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// URLエンコードされたPOSTボディを見て、削除する
		var method = req.body._method;
		delete req.body._method;
		return method;
	}
}));

// csrf対策
app.use(cookieParser());
app.use(expressSession({
	secret: 'secret_key',
	resave: true,
	saveUninitialized: true
}));
app.use(csrf());
app.use(function(req, res, next) {
	res.locals.csrftoken = req.csrfToken();
	next();
});

app.use(logger('dev'));

// routing

app.get('/', post.index);
app.get('/posts/:id([0-9]+)', post.show);
app.get('/posts/new', post.new);
app.post('/posts/create', post.create);
app.get('/posts/:id/edit', post.edit);
app.put('/posts/:id', post.update);
app.delete('/posts/:id', post.destroy);

app.use(function(err, req, res, next) {
	res.send(err.message);
});

app.listen(3000);
console.log("server starting...");
