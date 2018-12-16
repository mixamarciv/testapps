
const sqlite3 = require('sqlite3').verbose();
var s = require('./settings.js')();
const {wlog,wlogf,config,path} = s;

module.exports.connectToDB = connectToDB;

s.data.db.dbGameQuery = dbGameQuery;
s.data.db.dbGameRun = dbGameRun;

function connectToDB(fn){
  var dbfilepath = path.join2(__dirname,'/db');
  path.mkdir_path(dbfilepath,function(err){
      dbfilepath += '/dbfile1.db';
      wlog('Connect to the SQlite database: '+dbfilepath);
      s.data.db.dbgame = new sqlite3.Database(dbfilepath,sqlite3.OPEN_CREATE|sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
          return fn(err);
        }
        wlog('Connected to the SQlite database: '+dbfilepath);

        create_tables_dbgame(function(){
          s.data.db.dbgame.parallelize(()=>{
            fn();
          });
        });
      });
  });
}


function create_tables_dbgame(fn){
  var db = s.data.db.dbgame;
  db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS guser(
        id INTEGER,
        uuid TEXT,
        name TEXT NOT NULL,
        pass TEXT,
        email TEXT,
        datecreate TEXT,
        uinfo TEXT
      )`);
      db.run(`CREATE INDEX IF NOT EXISTS idx_guser_email ON guser(email); `);
      db.run(`CREATE INDEX IF NOT EXISTS idx_guser_id ON guser(id); `);
      db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_guser_uuid ON guser(uuid); `);
      db.run(`CREATE INDEX IF NOT EXISTS idx_guser_namepass ON guser(name,pass); `);
      db.run(`CREATE TABLE IF NOT EXISTS gmatches(
        uuid TEXT,
        id_user1 INTEGER,
        id_user2 INTEGER,
        user_vin    INTEGER,
        user_lose   INTEGER,
        user_start  INTEGER,
        mtime TEXT,
        mstart TEXT,
        mend   TEXT,
        minfo TEXT
      )`)
      db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_gmatches_uuid ON gmatches(uuid); `);
      db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_gmatches_id1 ON gmatches(id_user1); `);
      db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_gmatches_id2 ON gmatches(id_user2); `);
      db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_gmatches_vin  ON gmatches(user_vin); `);
      db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_gmatches_lose ON gmatches(user_lose); `);
      db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_gmatches_mend ON gmatches(mend); `);

      var sql1 = `SELECT name FROM sqlite_master 
                  WHERE name NOT LIKE 'sqlite_%' 
                    AND (type = 'table' OR type = 'index')
                  `;
      db.all(sql1,[],(err, rows ) => {
          wlog('database ready:');
          wlogf(rows); 
          fn();
      });
  });
}

function dbGameQuery(sql,args){
  var db = s.data.db.dbgame;
  if(!args) args = [];
  return new Promise(function(resolve, reject) {
    db.all(sql,args,(err, rows ) => {
      resolve(rows);
    });
  });
}

function dbGameRun(sql,args){
  var db = s.data.db.dbgame;
  if(!args) args = [];
  return new Promise(function(resolve, reject) {
    db.run(sql,args,(err) => {
      if(err) reject(err);
      resolve(0);
    });
  });
}
