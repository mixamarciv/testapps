
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
    lastTime: new Date(),
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

  m.options.mapdata = renderMap(m.options);
  m.options.lastTime = new Date();
  sendMatchPlayers(m,'fulldata',m.options);
}

function reconnectToGame(id,socket,options){
  console.log('reconnectToGame() '+id);
  var m = s.data.matches_play[id];
  m.options.lastTime = new Date();
  socket.emit('fulldata',m.options);
}

//генерим карту по заданным параметрам
//  случайным образом создаем область размером:
//     options.mapsize.x/2 на options.mapsize.y/2
//  - далее копируем её зеркально отражая на остальные части области 
// кому принадлежит ячейка определяем умножая номер пользователя на 1000 
// и прибавляем к значению ячейки  (например юзер2 * 1000 + 7)
// активная или нет ячейка определяем прибавляя 100
function renderMap(options){
  var map = [];
  var xd2 = options.mapsize.x/2;
  var yd2 = options.mapsize.y/2;
  for(let x=0;x<xd2;x++){
    map[x] = [];
    for(let y=0;y<yd2;y++){
      var v = getInitHexValue();
      map[x][y] = v;
    }
  }

  //выбираем позицию игроков:
  var px = getRandomInt(0,xd2/4);
  var py = getRandomInt(0,yd2/4);
  var px2,py2;

  //console.log(map);
  for(let x2=xd2, x=xd2-1; x2 < options.mapsize.x; x--,x2++){
    map[x2] = [];
    let mapx = map[x];
    for(let y = 0; y < yd2; y++){
        map[x2][y] = mapx[y];
    }
  }
  for(let x=0; x<options.mapsize.x; x++){
    mapx = map[x];
    for(let y = 0, y2 = options.mapsize.y-1; y < yd2; y++, y2--){
        mapx[y2] = mapx[y];
    }
  }
  //console.log(map);

  var rnd = getRandomInt(0, 100);
  px2 = options.mapsize.x - 1 - px;
  py2 = options.mapsize.y - 1 - py;
  if(rnd>50){
    px2 = px;
    px = options.mapsize.x - 1 - px;
  }
  if(rnd%2){
    py2 = py;
    py = options.mapsize.y - 1 - py;
  }

  map[px ][py ] = 7 + 1000 + 100;
  map[px2][py2] = 7 + 2000 + 100;
  //console.log(map);
  return map;
}

renderMap({mapsize:{x:12,y:12}});

//генерим случайное число или пустой блок
function getInitHexValue(){
  var rnd = getRandomInt(0, 15);
  if(rnd==0) return 0;
  rnd = Math.floor(rnd/4);
  return rnd;
}

//генерим случайное число или пустой блок
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
