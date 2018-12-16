
window.loaderjsfiles = {
    loadStart: 0,
    loadTime: 0,
    oklist: [],
    okservers: [],
    totalFiles: 0,
    cntLoad: 0,
    cntError: 0,
    errorFiles: [],
    okFiles: [],
    strLoadList: [],
}

window.loaderjsfiles.load = async function(){
    var loader = window.loaderjsfiles;
    loader.loadStart = new Date();
    loadingJsFilesProgressShow();
    var servers = [
        'http://192.168.0.245:9801/',
        '',
    ];

    var files = [
        "clientfiles/html/game1/fnc.js",
        "clientfiles/html/game1/config.js",
        "clientfiles/html/game1/preload.js",
        "clientfiles/html/game1/objhex.js",
        "clientfiles/html/game1/createmap.js",

        "clientfiles/html/game1/gametouch.js",
        "clientfiles/html/game1/game.js",

        "clientfiles/html/game1/gameaction.js",

        "clientfiles/html/game1/createmapmenu.js",
        "clientfiles/html/game1/textmessage.js",
        "clientfiles/html/game1/debug.js",
        "clientfiles/html/game1/menu/main.js",
        "clientfiles/html/game1/menu/netgame.js",
    ];

    loader.totalFiles = files.length;
    loader.cntLoad = 0;
    loader.cntError = 0;
    for(var i=0;i<files.length;i++){
        var file = files[i];
        await loadJsFileFromServers(servers,file);
    }
    loader.loadTime = new Date() - loader.loadStart;
    loadingJsFilesProgressShow2();
    return;
}

async function loadJsFileFromServers(servers,file){
    for(var i=0;i<servers.length;i++){
        var server = servers[i];
        var url = server + file;
        loadingJsFilesProgressShow2(-1,url);
        var b = await loadJsFile(url);
        loadingJsFilesProgressShow2(b,url);
        if(b) return 1;
    }
    return 0;
}

function loadJsFile(url) {
    return new Promise(function(succeed, fail) {
        $.getScript( url )
        .done(function( script, textStatus ) {
            //console.log( textStatus );
            window.loaderjsfiles.cntLoad++;
            window.loaderjsfiles.okFiles.push(url);
            window.loaderjsfiles.strLoadList.push('ok: '+url);
            succeed(1);
        })
        .fail(function( jqxhr, settings, exception ) {
            window.loaderjsfiles.cntError++;
            window.loaderjsfiles.errorFiles.push(url);
            window.loaderjsfiles.strLoadList.push('err: '+url);
            //fail(new Error("Load error"));
            succeed(0);
        });
    });
}

function loadingJsFilesProgressShow(){
    $('#loadjsfilesprogress').show();
    $('#loadjsfilesprogress').html(`
    <center>
    <h1>загрузка...</h1>
    <h2> сейчас все будет ) </h2>
    </center>
    `);
}
function loadingJsFilesProgressShow2(b,url){
    
    var t = window.loaderjsfiles;
    var curload = ''
    if(arguments.length!=0){
        var status = b==1 ? 'ok':'err';
        if(b==-1) status = 'загрузка';
        curload = status+ ': '+url;
    }else
    if(arguments.length==0){ // значит все загружено уже
        var st = date_to_str_format(t.loadStart,'D.M.Y h:m:s');
        curload = 'от '+st+' за ' + t.loadTime + 'мс';
    }
    var total = t.totalFiles;
    var cntLoad = t.cntLoad;
    $('#loadjsfilesprogress').html(`
        <center>
            <h3>загружено файлов: ${cntLoad} / ${total}</h3>
            <h4>${curload}</h4>
        </center>
    `);

    var str = '';
    for(i in t.strLoadList){
        var s = t.strLoadList[i];
        str += s + '<br>';
    }
    $('#loadjsfilesprogressfiles').html(str);
}
