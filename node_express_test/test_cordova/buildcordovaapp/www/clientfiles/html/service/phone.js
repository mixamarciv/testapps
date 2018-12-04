//https://developer.mozilla.org/ru/docs/Web/API/Touch_events    - отслеживаем touch event'ы
window.service_phone = {}

function justForTesting() {
	logOb.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			console.log(this.result);
		};

		reader.readAsText(file);
	}, fail);
}

//  https://www.npmjs.com/package/cordova-plugin-sms-receive
//  https://github.com/Pyo25/Phonegap-SMS-reception-plugin
//  https://stackoverflow.com/questions/35674135/detecting-incoming-call-on-android-device-with-cordova
// https://www.npmjs.com/package/cordova-call
/**********
cordova.plugins.CordovaCall.on('answer', handler); // A user-defined function that gets executed when you answer an incoming call
cordova.plugins.CordovaCall.on('hangup', handler); // A user-defined function that gets executed when you hangup a call
cordova.plugins.CordovaCall.on('reject', handler); // A user-defined function that gets executed when you reject an incoming call
cordova.plugins.CordovaCall.on('receiveCall', handler); //A user-defined function that gets executed when you receive a call
cordova.plugins.CordovaCall.on('sendCall', handler); // send call
***********/

window.service_phone.init = function(){
    if(!window.service_phone.f_file) window.service_phone.f_file = {};
}

window.service_phone.createFileLocal = function(fileName,callBack){
    window.service_phone.init();
    var f = window.service_phone.f_file[fileName];
    if(f) return callBack(f);
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        console.log("got main dir",dir);
        dir.getFile(fileName, {create:true}, function(file) {
            console.log("got the file", file);
            window.service_phone.f_file[fileName] = file;
            callBack(file);
        });
    });
}


window.service_phone.writeFileLocal = function(fileName,str,callBack) {
    window.service_phone.createFileLocal(fileName,function(logOb){
        var log = "[" + (new Date()) + "] "+str+"\n";
        console.log("going to log "+log);
        logOb.createWriter(function(fileWriter) {
            
            fileWriter.seek(fileWriter.length);
            
            var blob = new Blob([log], {type:'text/plain'});
            fileWriter.write(blob);
            console.log("ok, in theory i worked");
            callBack();
        }, function(){
            console.log("ERROR logOb.createWriter");
            callBack("ERROR logOb.createWriter");
        });
    });
}


window.service_phone.readFile = function(fileName,callBack){
    window.service_phone.createFileLocal(fileName,function(logOb){
        logOb.file(function(file) {
            var reader = new FileReader();
    
            reader.onloadend = function(e) {
                console.log(this.result);
            };
    
            reader.readAsText(file);
        }, /*fail*/ function(){
            console.log("ERROR logOb.createWriter");
            callBack("ERROR logOb.createWriter");
        });
    });
}

