const route = require('./routes/route.js'),
      express = require('express'),
      bodyParser = require('body-parser');

var   app = express();

route.startService();

app.disable( 'x-powered-by' );
app.set('trust proxy', (ip) => true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/v1/db/:table/', route.select);
app.post('/api/v1/db/:table/', route.insert);
app.put('/api/v1/db/:table/', route.update);
app.delete('/api/v1/db/:table/', route.delete);

app.use(function(err, req, res, next) {
    res.send(err.message);
});

app.listen(3000);

process.on('SIGINT', () => {
    process.exit();
});

process.on('exit', (code) => {
    route.stopService();
    console.log('disconnected.');
});

