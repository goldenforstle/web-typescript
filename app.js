var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const hist = require('history');

var $ = require('jquery');

var app = express();

var router = express.Router()

var serverRoutes = require('./server/routes')
// view engine setup

app.set('views', path.join(__dirname, 'client'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));

//Mongodb Setting
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/ovatio');

// Make our db accessible to our router
app.use(function (req, res, next) {
	req.db = db;
	next();
});

//Enable Server API 
app.use('/api', serverRoutes)

app.use(express.static('client'))

app.get('*', (req, res) => {
	res.render('index')
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	// err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
