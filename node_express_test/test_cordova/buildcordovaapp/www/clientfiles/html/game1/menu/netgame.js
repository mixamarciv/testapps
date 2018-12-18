
window.netGame = {
  sc_gamelist: null,
  sc_match: null,
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
    mainMenu.updateListNetGames(d);
  });
}

//обновляем информацию о пользователе на сервере
netGame.registerUser = function(fn){
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


netGame.createNetGame = function(options,fn){
    var netOptions = {  // параметры сетевой игры (должны быть у обоих юзеров одинаковые)
        id: 0,          // если создаем игру то id игры == id юзера (для создания отправляем id=0)
        user1: GOptions.user,
        user2: null,
        turnUserid: 0, // юзер который сейчас ходит
        cntmove: 0, // количество перемещений
        cntinc: 0,  //
        cntturn: 0, // количество завершенных ходов
        mapsize: options.mapsize, //{x:0,y:0},  // размер карты
    }
    GOptions.net = netOptions;

    const server = 'http://'+ GOptions.server +'/match';
    console.log('connect to server: '+server);
    netGame.sc_match = io.connect(server);

    netGame.sc_match.on('connect', function (d) {
      console.log('sc_match connect',d);
      mainMenu.createNetGameStatusShow('подключение успешно установлено, игра создана, ждем противника..');
      netGame.sc_match.emit('startoptions',GOptions.net);
      netGame._work_with_messages();
    });
    netGame.sc_match.on('error', function (err) {
      console.log('sc_match error',err);
      mainMenu.createNetGameStatusShowError('ОШИБКА подключения: '+err);
    });
}

netGame.connectNetGame = function(id,fn){
    var netOptions = {  // параметры сетевой игры (должны быть у обоих юзеров одинаковые)
        id: id,
        user2: GOptions.user,  // отправляем параметры второго (нашего игрока)
    }
    GOptions.net = netOptions;

  const server = 'http://'+ GOptions.server +'/match';
  console.log('connect to server: '+server);
  netGame.sc_match = io.connect(server);

  netGame.sc_match.on('connect', function (d) {
    console.log('sc_match connect',d);
    mainMenu.connectNetGameStatusShow(id,'подключение успешно установлено, идет синхронизация..');
    netGame.sc_match.emit('startoptions',GOptions.net);
    netGame._work_with_messages();
    fn();
  });
  netGame.sc_match.on('error', function (err) {
    console.log('sc_match error',err);
    mainMenu.connectNetGameStatusShowError(id,'ОШИБКА подключения: '+err);
    fn();
  });
}

netGame._work_with_messages = function(){
  netGame.sc_match.on('fulldata',netGame.on_fulldata);
  netGame.sc_match.on('data',netGame.on_data);
  netGame.sc_match.on('endturn',netGame.on_endturn);
  netGame.sc_match.on('endgame',netGame.on_endgame);
}

netGame.on_fulldata = function(options){
  GOptions.net = options;
  GOptions.localStorage_save();

  mainMenu.gameShow();
  createmap.setMapDataFromNet();
}

netGame.on_data = function(options){
  options.lastTime;
  options.turnn;
  options.arrdata;                
  // данные   перемещение в виде: 
  //['m', frombefore[x1,y1,v2105],tobefore[1,1,v1]
  //      fromafter [x1,y1,v2001],toafter [1,1,v2104]  ]
  // инкремент в виде ['i',from[x1,y1,v1101],to[1,1,v2104]]
  hexmap.set_netarrdata(options);
}

netGame.send_data = function(data){
  options.id = gamedata.status.id;
  options.turnn = gamedata.status.turnn;
  options.arrdata = data; 
  netGame.sc_match.emit('data',options);
}
