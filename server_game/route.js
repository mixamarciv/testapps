
var s = require('./settings.js')();
const {wlog,wlogf,config,path} = s;

const sqlquery = s.data.db.dbGameQuery;
const sqlrun = s.data.db.dbGameRun;
const type = s.mixa.type;

module.exports.loadRoutes = loadRoutes;

function loadRoutes(io){
  var gamelist = io.of('/game');
  gamelist.on('connection', function (socket) {
    console.log('connection: ');
    
    var list = getListGames();
    socket.emit('list', list);

    socket.on('connecttogame',connectToGame);
    socket.on('createnewgame',createNewGame);
    socket.on('registeruser',(user)=>{registerUser(socket,user);});
    socket.on('updateuser',(user)=>{updateUser(socket,user);});
  });


}

function getListGames(){
  console.log('getListGames()');
  var arrGames = [
    { name: 'superserver', startTime: new Date()},
  ];

  var d = {
    time: new Date(),
    gamelist: arrGames,
  }
  return d;
}

function connectToGame(d){
  console.log('connectToGame: ');
  console.log(d);
}

function createNewGame(d){
  console.log('createNewGame: ');
  console.log(d);
}

async function registerUser(socket,user){
  if(!type.is_object(user) || user.id===undefined || user.name===undefined){
    console.log('bad user data: ');
    console.log(user);
    return;
  }
  if(user.id==-1 || user.uuid==''){
    return await registerUserNew(socket,user);
  }
  console.log('old user reg: ');
  console.log(user);
  var u = await findUser(user);
  socket.emit('registeruser', u);
}

async function updateUser(socket,user){
  if(!type.is_object(user) || user.id===undefined || user.name===undefined){
    console.log('bad user data: ');
    console.log(user);
    return;
  }
  if(user.id==-1 || user.uuid==''){
    await registerUserNew(socket,user);
    socket.emit('updateuser', user);
  }

  var u0 = s.extend({},user);  // копируем данные пользователя в новый объект
  var u1 = await findUser(user);     // u1 - пользователь который в бд

  var sql = `UPDATE guser SET name=?, pass=?, email=? WHERE uuid=?`;
  var args = [u0.name, u0.pass, u0.email, u1.uuid];
  await sqlrun(sql,args);

  console.log('updateuser0: ');
  console.log(u0);
  console.log('updateuser1: ');
  console.log(u1);

  socket.emit('updateuser', u0);
}

async function findUser(user){
  var sql = `SELECT id,uuid,name,pass,email,datecreate,uinfo
             FROM guser WHERE uuid=?`;
  var rows = await sqlquery(sql,user.uuid);
  if(rows.length==0){
    return 0;
  }
  return rows[0];
}

async function registerUserNew(socket,user){
  console.log('new user reg: ');
  console.log(user);
  var u = user;
  u.uuid = s.mixa.uuid.v4();
  if(u.pass=='') u.pass = s.mixa.str.pass_generator(7);
  var tid = await sqlquery('SELECT IFNULL(MAX(id),100) AS id FROM guser');
  u.id = tid[0].id;

  var sql = `INSERT INTO guser(id,uuid,name, pass,email,datecreate, uinfo)
             VALUES(?,?,?, ?,?,?, ?)`;
  
  var args = [u.id,u.uuid,u.name, u.pass,u.email,u.datecreate, u.uinfo];
  await sqlrun(sql,args);
  console.log('add user to db:');
  console.log(u);

  socket.emit('registeruser', u);
}

/*****************
var io = require('socket.io')(81);
var chat = io
  .of('/chat')
  .on('connection', function (socket) {
    socket.emit('a message', {
        that: 'only'
      , '/chat': 'will get'
    });
    chat.emit('a message', {
        everyone: 'in'
      , '/chat': 'will get'
    });
  });

var news = io
  .of('/news')
  .on('connection', function (socket) {
    socket.emit('item', { news: 'item' });
  });
**************/
/***************
Client (index.html)
<script>
  var chat = io.connect('http://localhost/chat')
    , news = io.connect('http://localhost/news');
  
  chat.on('connect', function () {
    chat.emit('hi!');
  });
  
  news.on('news', function () {
    news.emit('woot');
  });
</script>
***************/
