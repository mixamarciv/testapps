const testurl = 'http://192.168.1.120:3082/?page=form/view_table&select_view=1&id_database=3&id_table=80000476004';
const phpinipath = 'c:\\_db_web\\php5\\php.ini';
const process_count = 5;             // количество процессов
const timeout_sec = 20;              // таймаут между проверками (сек)
const logfile = __filename+'.log';   // лог файл

const fs = require('fs');
const child_process = require('child_process');
const http = require('http');
const log = console.log;

var p = new process_runner();

flog('запуск процессов: '+process_count+'  таймаут: '+timeout_sec+'(сек)');
p.start(process_count);

setInterval(function(){
    check_http_request(function(test){
        if(test==0){
            flog('проверка не прошла, перезапускаем все процессы');
            p.restart();
        }else{
            flog('все отлично');
        }
    });
    log(`wait: ${timeout_sec} sec`);
},timeout_sec*1000);


//проверяем нормальный ли результат возвращают http запросы к серверу
//возвращает 1-ok или 0-err
function check_http_request(resolve){
    var req = http.get(testurl, function(res){
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        
        if(res.statusCode!=200) return resolve(0);

        var bodyChunks = [];
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            body = body.toString();
            console.log('body size: '+body.length);
            if(body.length > 1024*10) return resolve(1);
        })
    });
      
    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
        resolve(0);
    });
};

/******************************
setInterval(async function(){
    var test = await check_http_request();
    if(test==0){
        flog('проверка не прошла, перезапускаем все процессы');
        p.restart();
    }else{
        flog('все отлично');
    }
    log(`wait: ${timeout_sec} sec`);
},timeout_sec*1000);


//проверяем нормальный ли результат возвращают http запросы к серверу
//возвращает 1-ok или 0-err
const check_http_request = () => new Promise((resolve, reject) => {
    var req = http.get(testurl, function(res){
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        
        if(res.statusCode!=200) return resolve(0);

        var bodyChunks = [];
        res.on('data', function(chunk) {
            bodyChunks.push(chunk);
        }).on('end', function() {
            var body = Buffer.concat(bodyChunks);
            body = body.toString();
            console.log('body size: '+body.length);
            if(body.length > 1024*10) return resolve(1);
        })
    });
      
    req.on('error', function(e) {
        console.log('ERROR: ' + e.message);
        resolve(0);
    });
});
***********************/

//запуск и рестарт процессов
function process_runner(){
    var procs = [];

    this._process_count = 0;
    this.start = function(process_count){
        this._process_count = process_count;
        log('run process count: '+process_count+' ...');
        var command = 'php-cgi.exe'
        var command_params = [ '-b','127.0.0.1:9000'
                              ,'-c',phpinipath
                             ];
        for(var i=0;i<process_count;i++){
            var port = 9000 + i;
            command_params[1] = '127.0.0.1:'+port;
            var run_php_command = command + ' ' + command_params.join(' '); 
        
            log('run: '+run_php_command);
            var proc = child_process.spawn(command,command_params);
            procs.push(proc);
        }
    }

    this.kill = function(){
        log(`kill process `+procs.length);
        for(var i=0;i<procs.length;i++){
            var proc = procs[i];
            proc.kill('SIGINT');
        }
    }

    this.restart = function(){
        log(`restart all process `+this._process_count);
        this.kill();
        this.start(this._process_count);
    }

    return this;
}

function flog(msg){
    var datetime = date_format("YMD-hms");
    var str = datetime+" "+msg;
    fs.writeFileSync(logfile, str+"\n",{flag:'a'});
    console.log(msg);
}

function date_format(time,format_str){
    if(arguments.length==1){
          format_str = time;
          time = new Date();
    }else{
          time = new Date(time);
          /*if (typeof(time)!=='Date') {
                return "WRONG TIME";
          }*/
    }
    
    var s = String(format_str);
    if(!s || s=="") s = "Y.M.D (W) h:m:s.k";
    if(/Y/gm.test(s)) s = s.replace(/Y/gm,time.getFullYear());
    if(/M/gm.test(s)) s = s.replace(/M/gm,String(100+time.getMonth()+1).substring(1));       
    if(/D/gm.test(s)) s = s.replace(/D/gm,String(100+time.getDate()).substring(1));          
    if(/W/gm.test(s)) s = s.replace(/W/gm,time.getDay());                                    
    if(/h/gm.test(s)) s = s.replace(/h/gm,String(100+time.getHours()).substring(1));
    if(/m/gm.test(s)) s = s.replace(/m/gm,String(100+time.getMinutes()).substring(1));
    if(/s/gm.test(s)) s = s.replace(/s/gm,String(100+time.getSeconds()).substring(1));
    if(/k/gm.test(s)) s = s.replace(/k/gm,String(1000+time.getMilliseconds()).substring(1));
    return s;
}
