var http = require('http');
var express = require('express');
var app = express();

var s = require('./settings.js')();
const {wlog,wlogf,config} = s;


app.use('/clientfiles', express.static(__dirname + '/clientfiles'));
app.use(require('./routers/default.js'));


var server = http.createServer(app);

require('kill-prev-app-process')(function () {
	server.listen({
		host: config.app.host,
		port: config.app.port,
		exclusive: true
	}).on('error',function(err){
		wlogf("ERROR start listener %s:%s: %o",config.app.host,config.app.port,err);
	}).on('listening',function(){
		wlogf("server listening %s:%s",config.app.host,config.app.port);
	
	});
});



