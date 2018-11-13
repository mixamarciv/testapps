var argv = require('minimist')(process.argv.slice(2));  // параметры с командной строки
const path = require('path');

var config = {}
module.exports = config;

config.argv = argv;

config.app = {          // общие параметры приложения
	host: argv.host || '',//'127.0.0.1',
	port: argv.port || 9800 
}

config.db_options = {
    dbtype: 'firebird',
	database: path.join(__dirname,'/../db/db1.fdb'),  //полный путь к бд
	host: '127.0.0.1',
	//host: '192.168.0.14',
    port: 3050,            // default
    user: 'SYSDBA',        // default
    password: 'masterkey', // default
    role: null,            // default
    pageSize: 4096,        // default when creating database
    cp: 'win1251',
    table_prefix: ""
};
