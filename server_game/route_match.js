
var s = require('./settings.js')();
const {wlog,wlogf,config,path} = s;

const sqlquery = s.data.db.dbGameQuery;
const sqlrun = s.data.db.dbGameRun;
const type = s.mixa.type;

const updateListGamesOnAllClients = require('./route_game.js').updateListGamesOnAllClients;

module.exports.loadRoutes = loadRoutes;

function loadRoutes(io){
  s.data.sc_match = io.of('/match');
  s.data.sc_match.on('connection', function (socket) {
    console.log('connection: ');
    
    socket.on('startoptions',(options)=>{startoptions(socket,options);});

  });
}

function startoptions(socket,options){
  console.log('startoptions()');
  var id = options.id; // id игры == user1.id - юзер1 - пользователь который создал игру
  if(id>0){ // если id задан то подключаемся к уже существующей игре
    console.log('connect to id:'+id);
    
    var m = s.data.matches_wait[id];
    if(m){
      return connectToNewGame(id,socket,options);
    }
    
    m = s.data.matches_play[id];
    if(!m) {
        var msg = 'ошибка связи, игра['+id+'] не найдена или уже завершена';
        console.log('ERROR '+id+' '+msg);
        try{
          socket.emit('error',msg);
        }catch(err){
          if(socket && typeof socket.close == 'function') socket.close();
        }
        return;
    }
    return reconnectToGame(id,socket,options);
  }

  var u = options.user1;
  if(!u.id || u.id==-1){
    socket.emit('error','вы не зарегистрированы в игре!');
    return setTimeout(()=>{ socket.close(); },100);
  }

  id = options.user1.id;
  return startNewGame(id,socket,options);
}

function startNewGame(id,socket,options){
  console.log('startNewGame() '+id);
  options.id = id;  // обязательно задаем id, теперь пользователи могут переподключаться по этому id
  var data = {
    socket1: socket,
    socket2: null,
    options: options,
    startTime: new Date(),
  }
  s.data.matches_wait[id] = data;
  updateListGamesOnAllClients();
}

function sendMatchPlayers(m,name,data){
  m.socket1.emit(name,data);
  m.socket2.emit(name,data);
}

function connectToNewGame(id,socket,options){
  console.log('connectToNewGame() '+id);
  var m = s.data.matches_wait[id];
  var opt = m.options;
  opt.user2 = options.user2;
  m.socket2 = socket;
  delete s.data.matches_wait[id];
  s.data.matches_play[id] = m;
  sendMatchPlayers(m,'fulldata',m.options);
}

function reconnectToGame(id,socket,options){
  console.log('reconnectToGame() '+id);
  var m = s.data.matches_play[id];
  sendMatchPlayers(m,'fulldata',m.options);
}

