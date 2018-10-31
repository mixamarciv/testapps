var express = require('express');
var rfnc = require('../app_routerfnc.js')

var router = express.Router();
module.exports = router;

var v = require('../app_fnc.js')();
var db = require('../app_dbfnc.js')
const {wlog,wlogf,path,extend,fs,url,util} = v;
const loading_time = v.mixa.str.time_duration_str;
const date_to_str_format = v.mixa.str.date_to_str_format;

const DEBUG = 0;


//выдаем ответ на урл вида: http://127.0.0.1:5000/?url=https://m.winline.ru/plus/4049760
router.get('/calc', function(req, res){
	rfnc.start_load(req, res);
    page_main(req,res,function(err,html){
		if(err){
			return rfnc.res_send(req, res, util.format('%o',err));
		}
		rfnc.res_send(req, res, html);
	});
});


async function page_main(req,res,fnc_ret){
	var html = fs.readFileSync(path.join(__dirname,'page_calc.html'));
	html = html.toString();
	return fnc_ret(null,html);
}





