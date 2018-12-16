var s = {}

var is_init = 0;
module.exports = function() {
	if(is_init++>0) return s;

	//s.config = require('./config.js');
	prepare_work_dir();
	return s;
}

s.data = {};    //список глобальных переменных
s.data.app_start_time = new Date();
s.data.db = {}; //список установленных подключений к бд

s.argv = require('minimist')(process.argv.slice(2));
s.os   = require('os');
s.fs   = require('fs');
s.url  = require('url');
s.util = require('util');
s.path = require('path');
s.extend = require('node.extend');

s.mixa = require('mixa_std_js_functions');

s.path.join2      = s.mixa.path.join;
s.path.norm2      = s.mixa.path.norm;
s.path.normalize2 = s.mixa.path.norm;
s.path.mkdir_path = s.mixa.path.mkdir_path;

//--------------------------------------

s.wlog = wlog;
var _wlog_prev_t = new Date();
function wlog(str){
	var newdate = new Date();
	var datetime = s.mixa.str.date_to_str_format("YMD-hms");
	var datestr = s.mixa.str.date_to_str_format("YMD");
	var timefromprevcall = s.mixa.str.time_duration_str(_wlog_prev_t,newdate); 
	_wlog_prev_t = newdate;
	str = datetime+" "+timefromprevcall.padStart(10)+" "+str;
	s.fs.writeFileSync(datestr+'.log', str+"\n",{flag:'a'});
	console.log(str)
}

s.wlogf = wlogf;
function wlogf(){
	var format = s.util.format;
	//wlog( format.call(arguments) );
	wlog( format.apply(format, arguments) );
}

function prepare_work_dir(){
	s.data.work_path = s.path.norm2(__dirname+'/temp');
	if(!s.fs.existsSync(s.data.work_path)) s.fs.mkdirSync(s.data.work_path);
	process.chdir(s.data.work_path);
	wlog('chdir: '+s.data.work_path);
}


s.callbackToPromise0p = // переводит каллбек функцию без параметров в промис 
function callbackToPromise1p(callbackfunc) {
    return new Promise(function(resolve, reject) {
        callbackfunc(function(err) {
            if (err !== null) reject(err);
            else resolve.apply(resolve, Array.from(arguments).slice(1));
        });
    });
}

s.callbackToPromise1p = // переводит каллбек функцию с одним параметром в промис 
function callbackToPromise1p(callbackfunc,param1) {
    return new Promise(function(resolve, reject) {
        callbackfunc(param1, function(err) {
            if (err !== null) reject(err);
            else{
				resolve.apply(resolve, Array.from(arguments).slice(1)); // возвращаем все кроме первого параметра
			}
        });
    });
}

s.callbackToPromise2p = // переводит каллбек функцию с двумя параметрами в промис 
function callbackToPromise2p(callbackfunc,param1,param2) {
    return new Promise(function(resolve, reject) {
        callbackfunc(param1,param2, function(err) {
            if (err !== null) reject(err);
            else resolve.apply(resolve, Array.from(arguments).slice(1)); // возвращаем все кроме первого параметра
        });
    });
}
