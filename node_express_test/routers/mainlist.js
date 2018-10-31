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

router.get('/mainlist', function(req, res){
	rfnc.start_load(req, res);
    page_list(req,res,function(err,html){
		if(err){
			return rfnc.res_send(req, res, util.format('%o',err));
		}
		rfnc.res_send(req, res, html);
	});
});



async function page_list(req,res,fnc_ret){
	var result = {matches_rel:[],cnt_matches_total:0,cnt_rel:0,cnt_rel_profit:0};
	var query = `
SELECT
	r.uuid AS uuid_rel,
	m.timestart AS timestart,
	m.status AS status,
	m.f_insert AS f_insert_match,
	m.uuid AS uuid_match,
	m.p1 AS p1,
	m.p2 AS p2,
	m.mtype AS mtype,
	m.mdesc AS mdesc,
	m.url AS url,
	c.f_insert AS f_insert_coef,
	c.schet1 AS schet1,
	c.schet2 AS schet2,
	c.schetinfo AS schetinfo,
	c.json AS json,
	c.mtime AS mtime,
	m.site AS site,
	'-' AS tmp
FROM match_rel r
	LEFT JOIN match m ON m.match_rel_uuid = r.uuid
	LEFT JOIN coefs c ON c.uuid = m.coefs_uuid
WHERE 1=1
  AND (SELECT COUNT(*) FROM match tm WHERE tm.match_rel_uuid=r.uuid AND tm.status!=2) > 0
 
ORDER BY r.uuid,m.site,m.f_insert
  `;
	var qres = await db.selectAsync(query);
	if(qres.length==0) return fnc_ret(null, '{}');
	var match_rel = {matches:[],coefs_prof:{},cnt:0};
	var prev_uuid_rel = '';
	for(let i=0;i<qres.length;i++){
		var q = qres[i];
		var rs = sqlfields_to_rs(q);
		result.cnt_matches_total++;
		if(rs.uuid_rel == prev_uuid_rel || i==0){
			match_rel.matches.push(rs);
			match_rel.cnt++;
		}else{
			result.matches_rel.push(match_rel);
			result.cnt_rel++;

			match_rel = {matches:[],coefs_prof:{},cnt:0};
			match_rel.matches.push(rs);
		}
		prev_uuid_rel = rs.uuid_rel;
	}
	
	if(result.cnt_matches_total>0){
		result.cnt_rel++;
		result.matches_rel.push(match_rel);
	}

	result_html = JSON.stringify(result);
	return fnc_ret(null, result_html);
}

var arr_sqlfields = [
	'uuid_rel',
	'uuid_match',
	'timestart',
	'status',
	'f_insert_match',
	'p1',
	'p2',
	'mtype',
	'mdesc',
	'f_insert_coef',
	'schet1',
	'schet2',
	'schetinfo',
	'json',
	'url',
	'site',
	'mtime'
];

function sqlfields_to_rs(q){
	var rs = {};
	for(let i=0;i<arr_sqlfields.length;i++){
		var field = arr_sqlfields[i];
		var sqlfield = field.toUpperCase();
		rs[field] = '-';
		if(q[sqlfield]) rs[field] = q[sqlfield].toString();
	}
	rs.timestart = date_format(rs.timestart);
	rs.f_insert_coef = date_format(rs.f_insert_coef);
	rs.f_insert_match = date_format(rs.f_insert_match);
	return rs;
}

function date_format(fielddate){
	if(fielddate=='-') return '-';
	fielddate = new Date(fielddate);
	fielddate = date_to_str_format(fielddate,'Y.M.D h:m:s');
	return fielddate;
}


