var express = require('express');
var s = require('../settings.js')();
var rfnc = require('./app_routerfnc.js')

var router = express.Router();
module.exports = router;


const {wlog,wlogf,path,extend,fs,url,util} = s;
const loading_time = s.mixa.str.time_duration_str;



const DEBUG = 0;


router.get('/test*', function(req, res) {
    console.log("-- url: -----------------------------------");
    console.log(req.originalUrl);
    console.log("-- ip: ------------------------------------");
    console.log(req.ip);
    console.log("-- body: ----------------------------------");
    console.log(req.body);
    console.log("-- query: ---------------------------------");
    console.log(req.query);
    console.log("-------------------------------------------");
    res.send(req.originalUrl);
});

//выдаем ответ на урл вида: http://127.0.0.1:5000/?url=https://m.winline.ru/plus/4049760
router.get('/', function(req, res){
	rfnc.start_load(req, res);
    page_main(req,res,function(err,html){
		if(err){
			return rfnc.res_send(req, res, util.format('%o',err));
		}
		rfnc.res_send(req, res, html);
	});
});



router.get('/list', async function(req, res){
	rfnc.start_load(req, res);
    page_list(req,res,function(err,html){
		if(err){
			return rfnc.res_send(req, res, util.format('%o',err));
		}
		rfnc.res_send(req, res, html);
	});
});

router.get('/list2', rfnc.asyncRoute(async function(req, res){
	var html = await page_list2(req,res);
	rfnc.res_send(req, res, html);
}));

async function page_main(req,res,fnc_ret){
	var html = fs.readFileSync(path.join(__dirname,'page_main.html'));
	html = html.toString();
	return fnc_ret(null,html);
}

async function page_list(req,res,fnc_ret){
	var html = `
	<div class="list-group">
	  <a href="/?db=1111" class="list-group-item">
		<h3 class="list-group-item-heading">название1 <small>[id:3000]</small></h3>
		<p class="list-group-item-text">информация</p>
	  </a>
  	</div>
  `;

	return fnc_ret(null, html);
}

const page_list2 = function (req,res){
	return s.callbackToPromise2p(page_list,req,res);
}



router.get('/phaser_test', rfnc.asyncRoute(async function(req, res){
	let clientfilespath = path.join2(s.data.work_path,'../clientfiles/');

	let phaserjsfile = path.join2(clientfilespath,'/phaser.min.js');
	let b = fs.existsSync(phaserjsfile);
	if(!b){
		let srcfile = path.join2(clientfilespath,'../node_modules/phaser-ce/build/phaser.min.js');
		wlogf('copy phaser-ce file from: %s to: %s',srcfile,phaserjsfile);
		fs.copyFileSync(srcfile,phaserjsfile);
	}
	let htmlfile = path.join2(clientfilespath,'/html/phaser_test.html');
	let html = fs.readFileSync(htmlfile);
	rfnc.res_send(req, res, html.toString());
}));

