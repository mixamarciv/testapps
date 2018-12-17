
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
  var u = options.user1;

  if(!u.id || u.id==-1){
    socket.emit('error','вы не зарегистрированы в игре!');
    setTimeout(()=>{
      socket.close();
    },1000);
    return;
  }

  var data = {
    socket1: socket,
    socket2: null,
    options: options,
    startTime: new Date(),
  }

  s.data.matches_wait[u.id] = data;
  updateListGamesOnAllClients();
}

