var s = require('../settings.js')();
const loading_time = s.mixa.str.time_duration_str;
const {wlog,wlogf,path,extend,fs,url,util} = s;

module.exports.start_load = start_load;
module.exports.res_send = res_send;
module.exports.asyncRoute = asyncRoute;

function start_load(req, res) {
	res.start_load_time = new Date();
	res.need_url = req.originalUrl;
	wlog('GET / <- '+res.need_url);
}

function res_send(req, res, result) {
	res.send(result);
	wlog('GET / -> ' + loading_time(res.start_load_time)+' size: '+result.length+' '+res.need_url);
}



const asyncRoute_short = route => (req, res, next = console.error) => {
	Promise.resolve(route(req, res)).catch(next)
}

function asyncRoute(route) {
	var route2 = async function(req, res, next){
		start_load(req, res);
		route(req,res,function(err){
			return res_send(req, res, util.format('ERROR: %o',err));
		});
	}
	return (req, res, next = console.error) => {
		Promise.resolve(route2(req, res)).catch(next)
	}
}

