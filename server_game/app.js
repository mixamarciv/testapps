const PORT = 81;

const sqlite3 = require('sqlite3').verbose();
var s = require('./settings.js')();
const {wlog,wlogf,config,path} = s;

var db = require('./db.js');
var route = require('./route_game.js');

require('kill-prev-app-process')(__dirname+'/temp/pid',async function () {
  wlog('start socket server on port: '+PORT);
  var io = require('socket.io')(81);

  db.connectToDB(function(err){
    route.loadRoutes(io);
  });
});


