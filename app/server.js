var path = require('path');
var http = require('http');
var st = require('st');
var connect = require('connect');

var conf = {
	port: process.env.PORT || 5000,
	path: {
		public: path.resolve(__dirname, '..', 'public'),
		data: path.resolve(__dirname, '..', 'data')
	}
};

var mount = st({
	path: conf.path.public,
	url: '/',
	index: 'index.html',
	passthrough: true,
	cache: false
});

var app = connect();
// app.use(connect.responseTime());
// app.use(connect.logger('dev'));
app.use(mount);
app.use(function (req, res) {
	res.statusCode = 404;
	res.end('not found');
});

http.createServer(app).listen(conf.port, function () {
	console.log('listening on ' + conf.port);
});
