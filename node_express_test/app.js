var http = require('http');
var express = require('express');
var app = express();

var s = require('./settings.js')();
const {wlog,wlogf,config,path} = s;


app.use('/clientfiles', express.static(path.join(__dirname,'/test_cordova/buildcordovaapp/www/clientfiles')));
app.use('/css', express.static(path.join(__dirname,'/test_cordova/buildcordovaapp/www/css')));
app.use('/img', express.static(path.join(__dirname,'/test_cordova/buildcordovaapp/www/img')));
app.use('/js', express.static(path.join(__dirname,'/test_cordova/buildcordovaapp/www/js')));
app.use('/cordova.js', (req, res)=>{res.send('"all ok";')});
app.use(require('./routers/default.js'));


var server = http.createServer(app);

require('kill-prev-app-process')(__dirname+'/temp/pid',function () {
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



