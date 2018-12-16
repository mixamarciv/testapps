
window.netGame = {
  sc_gamelist: null,
}

//отправляет евент с данными на сервер, ждет и возвращает результат
window.netGame.sendAndReciveSc = function(socket,eventName,data){
  return new Promise(function(resolve, reject) {
    socket.emit(eventName,data);

    var t = setTimeout(()=>{
      //resolve(new Error('server timeout on event "'+eventName+'"'));
      resolve(0);
    },GOptions.serverTimeOut);

    socket.once(eventName,function(data){
      clearTimeout(t);
      resolve(data);
    });
  });
}

window.netGame.init = async function(){
  return new Promise(function(resolve, reject) {
    const server = 'http://'+ GOptions.server +'/game';
    console.log('connect to server: '+server);
    var gamelist = io.connect(server);
    window.netGame.sc_gamelist = gamelist;

    gamelist.on('connect', function (d) {
      console.log('gamelist connect',d);
      //console.log(d);
      netGame.f_loadEvents();
      return resolve(0);
    });
    gamelist.on('error', function (err) {
      console.log('gamelist.on error',err);
      //console.log(err);
      return resolve(err);
    });
  });
}

netGame.f_loadEvents = ()=>{
  var sc = netGame.sc_gamelist;
  sc.on('list', function (d) {
    console.log('gamelist.on list:');
    console.log(d);
  });
}

//обновляем информацию о пользователе на сервере
window.netGame.registerUser = function(fn){
  return new Promise(function(resolve, reject) {
    var sc = netGame.sc_gamelist;
    var user = window.GOptions.user;
    sc.emit('registeruser',user);

    var t = setTimeout(()=>{
      resolve(new Error('registerUser: server timeout'));
    },GOptions.serverTimeOut);

    sc.once('registeruser',function(user){
      clearTimeout(t);
      if(GOptions.checkUser(user) && user.id>0 && user.uuid!=''){
        GOptions.user = user;
        GOptions.localStorage_save();
        resolve(0);
      }
      resolve(new Error('registerUser: server bad result'));
      console.log(user);
    });
  });
}

window.netGame.updateUser = async function(user){
  var user = await netGame.sendAndReciveSc(netGame.sc_gamelist,'updateuser',user);
  if(GOptions.checkUser(user) && user.id>0 && user.uuid!=''){
    GOptions.user = user;
    GOptions.localStorage_save();
  }
  return user;
}


